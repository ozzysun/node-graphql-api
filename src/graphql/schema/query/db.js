const Sample = require('../types/sample')
const ORM = require('../../../core/db/orm')
const schemaData = {
  name: 'api_sysdb',
  type: [Sample],
  args: [
    { name: 'name', type: 'string' }
  ],
  resolve: async(parent, args, context, info) => {
    const orm = new ORM({ host: 'dbLocal', db: 'api_sysdb' })
    const sql = `select * from sample`
    const response = await orm.query(sql)
    return response
  }
}
module.exports = schemaData
