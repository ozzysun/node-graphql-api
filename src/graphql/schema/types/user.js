const { createType } = require('../../../core/graphql/util')
const getType = () => {
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
  return createType(typeData.name, typeData.fields)
}
module.exports = getType()
