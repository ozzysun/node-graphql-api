const graphql = require('graphql')
// 取得field設定檔
const getFieldConfig = (field) => {
  // 建立fields { name: , type: ,args}
  const fieldsObj = {
    type: getType(field.type)
  }
  // 檢查是否有args
  if (field.args !== undefined && Array.isArray(field.args)) {
    fieldsObj.args = {}
    field.args.forEach(arg => {
      fieldsObj.args[arg.name] = {
        type: getType(arg.type)
      }
    })
  }
  // 檢查是否有resolve
  if (field.resolve !== undefined) {
    fieldsObj.resolve = field.resolve
  }
  return fieldsObj
}
const getTypeConfig = (name = 'Query', fields = []) => {
  const fieldsObj = {}
  fields.forEach((field) => {
    fieldsObj[field.name] = getFieldConfig(field.config)
  })
  return {
    name: name,
    fields: fieldsObj
  }
}
const objectType = (name, fields) => {
  const configData = getTypeConfig(name, fields)
  return new graphql.GraphQLObjectType(configData)
}
const getType = (typeString) => {
  let result = graphql.GraphQLString
  switch (typeString) {
    case 'string':
      result = graphql.GraphQLString
      break
    case 'int':
      result = graphql.GraphQLInt
      break
    case 'boolean':
      result = graphql.GraphQLBoolean
      break
    case 'float':
      result = graphql.GraphQLFloat
      break
    default:
      result = typeString
  }
  return result
}
module.exports = { getTypeConfig, getFieldConfig, objectType }
