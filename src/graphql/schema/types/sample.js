const { createType } = require('../../../core/graphql/util')
const getType = () => {
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
  return createType(typeData.name, typeData.fields)
}
module.exports = getType()
