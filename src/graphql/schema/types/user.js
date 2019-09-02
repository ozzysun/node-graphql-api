const { createObjectType } = require('../../../core/graphql/util')
const typeData = {
  name: 'user',
  fields: [
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'age',
      type: 'int'
    }
  ]
}
module.exports = createObjectType(typeData.name, typeData.fields)
