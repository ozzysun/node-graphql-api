const graphql = require('graphql')
// 取得field設定檔
const getFieldConfig = (field) => {
  // 建立fields { name: , type: ,args}
  const fieldsObj = {
    type: getObjectType(field.type)
  }
  // 檢查是否有args
  if (field.args !== undefined && Array.isArray(field.args)) {
    fieldsObj.args = {}
    field.args.forEach(arg => {
      fieldsObj.args[arg.name] = {
        type: getObjectType(arg.type)
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
    fieldsObj[field.name] = getFieldConfig(field)
  })
  return {
    name: name,
    fields: fieldsObj
  }
}
// 建立objecType
const createObjectType = (name, fields) => {
  const configData = getTypeConfig(name, fields)
  return new graphql.GraphQLObjectType(configData)
}
// 輸入type字串取得objectType
const getObjectType = (val) => {
  // 當非字串 則直接回傳 不作轉換, 若為Array [xxx] or ['int']則轉換成List
  const isArray = Array.isArray(val)
  const typeString = isArray ? val[0] : val
  let typeObj = typeString
  if (typeof typeString === 'string') {
    switch (typeString) {
      case 'string':
        typeObj = graphql.GraphQLString
        break
      case 'int':
        typeObj = graphql.GraphQLInt
        break
      case 'boolean':
        typeObj = graphql.GraphQLBoolean
        break
      case 'float':
        typeObj = graphql.GraphQLFloat
        break
    }
  }
  return isArray ? new graphql.GraphQLList(typeObj) : typeObj
}
// 建立schema
const createSchema = (rootConfig) => {
  const queryType = new graphql.GraphQLObjectType(rootConfig)
  const schema = new graphql.GraphQLSchema({ query: queryType })
  return schema
}
module.exports = { getTypeConfig, getFieldConfig, createObjectType, createSchema }
