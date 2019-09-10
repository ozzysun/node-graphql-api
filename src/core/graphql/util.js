const graphql = require('graphql')
// --- 建立 Type ---------------------------
// 以field json設定建立Type內的field設定格式 { type ,args, resolve}
const getFieldConfig = (field) => {
  const fieldsObj = {
    type: getTypeByString(field.type)
  }
  // 檢查是否有args
  if (field.args !== undefined && Array.isArray(field.args)) {
    fieldsObj.args = {}
    field.args.forEach(arg => {
      const fieldType = getTypeByString(arg.type)
      fieldsObj.args[arg.name] = {
        type: fieldType
      }
      /* TODO:args處理預設值
      if (arg.default) {
        fieldsObj.args[arg.name] = {
          type: fieldType = arg.default
        }
      } else {
        fieldsObj.args[arg.name] = {
          type: fieldType
        }
      }
      */
    })
  }
  // 檢查是否有resolve
  if (field.resolve !== undefined) fieldsObj.resolve = field.resolve
  return fieldsObj
}
// 取得要建立type的設定檔
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
// 輸入type字串取得Graphql 預設提供的Type
const getTypeByString = (val) => {
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
// 建立objecType name:type名稱, fields:[{name,type,args,resolve}]
const createType = (name, fields) => {
  const configData = getTypeConfig(name, fields)
  return new graphql.GraphQLObjectType(configData)
}
// -- 建立 InputType -------
const createInputType = () => {

}
// -- 建立 Interface -------
// 設定並取得更新完的SchemaConfig 這是準備建立schema的資料 type:query|mutation
const getSchemaConfig = (type = 'query', schemaConfig, rootConfig = {}) => {
  const queryType = new graphql.GraphQLObjectType(schemaConfig)
  rootConfig[type] = queryType
  return rootConfig
}
module.exports = { getFieldConfig, getTypeConfig, getSchemaConfig, createType, createInputType }
