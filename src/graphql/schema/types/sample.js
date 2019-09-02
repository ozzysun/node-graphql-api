const { createObjectType } = require('../../../core/graphql/util')
const typeData = {
  name: 'Sample',
  fields: [
    {
      name: 'id',
      type: 'int'
    },
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'content',
      type: 'string'
    },
    {
      name: 'samplecol',
      type: 'string'
    },
    {
      name: 'post',
      type: 'string'
    },
    {
      name: 'subkey',
      type: 'string'
    }
  ]
}
module.exports = createObjectType(typeData.name, typeData.fields)
