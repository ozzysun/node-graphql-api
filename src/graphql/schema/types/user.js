const { createType } = require('../../../core/graphql/util')
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
module.exports = createType(typeData.name, typeData.fields)
