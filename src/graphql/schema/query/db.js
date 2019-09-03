const api_sysdb = require('../types/api_sysdb')
const schemaData = {
  name: 'db',
  type: api_sysdb,
  args: [
    { name: 'host', type: 'string' }, { name: 'db', type: 'string' }, { name: 'table', type: 'string' }
  ],
  resolve: async(parent, args, context, info) => {
    return { host: args.host, db: args.db, table: args.table }
  }
}
module.exports = schemaData
