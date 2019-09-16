const { createType } = require('../../../../core/graphql/util')
const getType = () => {
  const typeData = {
    name: 'menu',
    fields: [
      {
        name: 'id',
        type: 'int'
      }
    ]
  }
  return createType(typeData.name, typeData.fields)
}
module.exports = getType()
