const { createType } = require('../../../core/graphql/util')
const { createTableType } = require('../../../core/graphql/dbTable')
const ORM = require('../../../core/db/orm')
// const menu = require('./menuTypes/menu')
const storeTable = {
  host: 'dbTestMy',
  db: 'ec_dbf01_dbo',
  table: 'dbjp_aplsys_webmenu',
  name: 'storeInfoName'
}
const menuTable = {
  host: 'dbTestMy',
  db: 'ec_dbf01_dbo',
  table: 'product',
  name: 'storeMenuName'
}
const getType = async() => {
  const storeInfo = await createTableType(storeTable)
  const menu = await createTableType(menuTable)
  const typeData = {
    name: 'storeMenu',
    fields: [
      {
        name: 'store',
        type: storeInfo,
        resolve: async({ site, stock_no }, args, context, info) => {
          console.log(`hello site=${site} stock_no=${stock_no}`)
          const orm = new ORM({ host: storeTable.host, db: storeTable.db })
          const model = await orm.model(storeTable.table)
          const response = await model.findAndCountAll({
            where: { site, stock_no }
          })
          return response.rows[0]
        }
      },
      {
        name: 'menu',
        type: [menu],
        args: [
          { name: 'page', type: 'int' },
          { name: 'perPage', type: 'int' }
        ],
        resolve: async({ site, stock_no }, { page, perPage }, context, info) => {
          console.log(`hello site=${site} stock_no=${stock_no}`)
          const orm = new ORM({ host: menuTable.host, db: menuTable.db })
          const model = await orm.model(menuTable.table)
          const response = await model.findAndCountAll({
            where: { site },
            offset: (page - 1) * perPage,
            limit: perPage
          })
          return response.rows
        }
      }
    ]
  }
  return createType(typeData.name, typeData.fields)
}
module.exports = getType
