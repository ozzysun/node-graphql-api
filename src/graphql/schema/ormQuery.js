const path = require('path')
const { readJSON, loadFolderFiles } = require('../../core/utils/file')
const { createObjectType } = require('../../core/graphql/util')
const ORM = require('../../core/db/orm')
// 建立 指定table的ObjectType 之後用來當作db的欄位field
const createTableType = async(host, db, table) => {
  const modelPath = path.resolve(`./models/${host}/${db}/${table}.json`)
  // console.log(`load modelPath=${modelPath}`)
  const jsonData = await readJSON(modelPath)
  // 1. 建立table object type
  const typeData = {
    name: `${host}_${db}_${table}`,
    fields: []
  }
  for (const prop in jsonData[0]) {
    const fieldObj = {
      name: prop,
      type: converType(jsonData[0][prop].type)
    }
    typeData.fields.push(fieldObj)
  }
  // console.log('table typeData=')
  // console.log(typeData)
  return createObjectType(typeData.name, typeData.fields)
  // 建立 table query
}
const createDbType = async(host, db) => {
  // 1. 建立table object type
  const typeData = {
    name: `${host}_${db}`,
    fields: []
  }
  // 取得指定db下table 列表當作field
  const filePath = path.resolve(`./models/${host}/${db}`)
  const tables = await loadFolderFiles(filePath, 'json', 'name')
  for (let i = 0; i < tables.length; i++) {
    const tableName = tables[i]
    // table名稱有-則跳過
    if (tableName.indexOf('-') === -1) {
      const tableType = await createTableType(host, db, tableName)
      const fieldObj = {
        name: tableName,
        type: [tableType],
        args: [
          { name: 'page', type: 'int' },
          { name: 'perPage', type: 'int' }
        ],
        resolve: async(parent, args, context, info) => {
          const page = args.page ? args.page : 1
          const perPage = args.perPage ? args.perPage : 10
          const orm = new ORM({ host, db, table: tableName })
          const model = await orm.model(tableName)
          const response = await model.findAndCountAll({
            offset: (page - 1) * perPage,
            limit: perPage
          })
          /*
          const sql = `select * from ${tableName} limit 10`
          const response = await orm.query(sql)
          */
          return response.rows
        }
      }
      typeData.fields.push(fieldObj)
    }
  }
  // console.log('db typeData==')
  // console.log(typeData)
  return createObjectType(typeData.name, typeData.fields)
}
const createHostType = async(host, dbs) => {
  // 1. 建立host object type
  const typeData = {
    name: host,
    fields: []
  }
  for (let i = 0; i < dbs.length; i++) {
    const dbName = dbs[i]
    const dbType = await createDbType(host, dbName)
    const fieldObj = {
      name: dbName,
      type: dbType,
      resolve: async(parent, args, context, info) => {
        return { host, db: dbName }
      }
    }
    typeData.fields.push(fieldObj)
  }
  // console.log('host typeData==')
  // console.log(typeData)
  return createObjectType(typeData.name, typeData.fields)
}
const createOrmQuery = async(host, dbs) => {
  const hostType = await createHostType(host, dbs)
  const schemaData = {
    name: host,
    type: hostType,
    resolve: async(parent, args, context, info) => {
      return { host, dbs }
    }
  }
  return schemaData
}
// 將orm type轉成字串 , 字串之後再轉成scalar type
const converType = (ormTypeStr) => {
  const stringPatt = new RegExp(/STRING|TEXT|DATE/)
  const intPatt = new RegExp(/INTEGER|BIGINT/)
  const floatPatt = new RegExp(/FLOAT|DECIMAL|DOUBLE/)
  const booleanPatt = new RegExp(/BOOLEAN/)
  if (stringPatt.test(stringPatt)) {
    return 'string'
  } else if (intPatt.test(stringPatt)) {
    return 'int'
  } else if (floatPatt.test(stringPatt)) {
    return 'float'
  } else if (booleanPatt.test(stringPatt)) {
    return 'boolean'
  } else {
    return 'string'
  }
}
module.exports = { createOrmQuery }
