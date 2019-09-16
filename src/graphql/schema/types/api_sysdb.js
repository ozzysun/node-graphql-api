const { createType } = require('../../../core/graphql/util')
const Sample = require('./Sample')
const ORM = require('../../../core/db/orm')
const getType = () => {
  const typeData = {
    name: 'api_sysdb',
    fields: [
      {
        name: 'table',
        type: [Sample],
        args: [
          { name: 'name', type: 'string' }
        ],
        resolve: async(parent, args, context, info) => {
          const host = parent.host
          const db = parent.db
          const table = parent.table
          const orm = new ORM({ host, db, table })
          const sql = `select * from ${table}`
          const response = await orm.query(sql)
          return response
        }
      }
    ]
  }
  return createType(typeData.name, typeData.fields)
}
module.exports = getType()
