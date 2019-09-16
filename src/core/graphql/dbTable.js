const path = require('path')
const { createType } = require('./util')
const ORM = require('../db/orm')
const { readJSON, loadFolderFiles } = require('../utils/file')
// 建立 指定table的ObjectType 之後用來當作db的欄位field
const createTableType = async({ host, db, table, name }) => {
  const modelPath = path.resolve(`./models/${host}/${db}/${table}.json`)
  const jsonData = await readJSON(modelPath)
  // 1. 建立table object type
  const typeData = {
    name: name !== undefined ? name : `${host}_${db}_${table}`,
    fields: []
  }
  for (const prop in jsonData[0]) {
    const fieldObj = {
      name: prop,
      type: converType(jsonData[0][prop].type)
    }
    typeData.fields.push(fieldObj)
  }
  return createType(typeData.name, typeData.fields)
  // 建立 table query
}
const createDbType = async({ host, db, name }) => {
  // 1. 建立table object type
  const typeData = {
    name: name !== undefined ? name : `${host}_${db}`,
    fields: []
  }
  // 取得指定db下table 列表當作field
  const filePath = path.resolve(`./models/${host}/${db}`)
  const tables = await loadFolderFiles(filePath, 'json', 'name')
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i]
    // table名稱有-則跳過
    if (table.indexOf('-') === -1) {
      const tableType = await createTableType({ host, db, table })
      const fieldObj = {
        name: table,
        type: [tableType],
        args: [
          { name: 'page', type: 'int' },
          { name: 'perPage', type: 'int' }
        ],
        resolve: async(parent, args, context, info) => {
          const page = args.page ? args.page : 1
          const perPage = args.perPage ? args.perPage : 10
          const orm = new ORM({ host, db, table })
          const model = await orm.model(table)
          const response = await model.findAndCountAll({
            offset: (page - 1) * perPage,
            limit: perPage
          })
          return response.rows
        }
      }
      typeData.fields.push(fieldObj)
    }
  }
  return createType(typeData.name, typeData.fields)
}
const createHostType = async(host, dbs) => {
  // 1. 建立host object type
  const typeData = {
    name: host,
    fields: []
  }
  for (let i = 0; i < dbs.length; i++) {
    const db = dbs[i]
    const dbType = await createDbType({ host, db })
    const fieldObj = {
      name: db,
      type: dbType,
      resolve: async(parent, args, context, info) => {
        return args
      }
    }
    typeData.fields.push(fieldObj)
  }
  return createType(typeData.name, typeData.fields)
}
// 將orm type轉成字串 , 字串之後會被用來轉成scalar type
const converType = (ormTypeStr) => {
  const stringPatt = new RegExp(/STRING|TEXT|DATE/)
  const intPatt = new RegExp(/INTEGER|BIGINT/)
  const floatPatt = new RegExp(/FLOAT|DECIMAL|DOUBLE/)
  const booleanPatt = new RegExp(/BOOLEAN/)
  if (stringPatt.test(ormTypeStr)) {
    return 'string'
  } else if (intPatt.test(ormTypeStr)) {
    return 'int'
  } else if (floatPatt.test(ormTypeStr)) {
    return 'float'
  } else if (booleanPatt.test(ormTypeStr)) {
    return 'boolean'
  } else {
    return 'string'
  }
}
module.exports = { createTableType, createDbType, createHostType }
