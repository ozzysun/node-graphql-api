const { objectType } = require('../../../core/graphql/util')
const schemaData = {
  name: 'user',
  fields: [
    {
      name: 'firstName',
      config: {
        type: 'string'
      }
    },
    {
      name: 'age',
      config: {
        type: 'int'
      }
    }
  ]
}
module.exports = objectType(schemaData.name, schemaData.fields)
