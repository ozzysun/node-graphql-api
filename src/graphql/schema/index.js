const { getTypeConfig, getFieldConfig, getSchemaConfig } = require('../../core/graphql/util')
const { loadFolderFiles } = require('../../core/utils/file')
const { createHostType } = require('../../core/graphql/dbTable')
const graphql = require('graphql')
const path = require('path')
// -- Query -----------
// 1.1 載入query目錄下設定的query
const loadQuery = async(rootConfig) => {
  // 載入所有query目錄下的設定
  const filePath = `${global.dir.bin}/graphql/schema/query`
  const files = await loadFolderFiles(filePath, 'js', 'full')
  for (let i = 0; i < files.length; i++) {
    const querySchema = global.require2(files[i]) // 取得query設定
    if (typeof querySchema === 'object') {
      rootConfig.fields[querySchema.name] = getFieldConfig(querySchema) // 產生query並設定到root fields下
    } else if (typeof querySchema === 'function') {
      const asyncQuerySchema = await querySchema()
      rootConfig.fields[querySchema.name] = getFieldConfig(asyncQuerySchema)
    }
  }
  return rootConfig
}
// 1.2 載入orm Query
const getOrmQuery = async(host, dbs) => {
  const hostType = await createHostType(host, dbs)
  const schemaData = {
    name: host,
    type: hostType,
    resolve: async(parent, args, context, info) => {
      return args
    }
  }
  return schemaData
}
const createOrmQuery = async(queryRoot) => {
  // 加入 指定 db 的ormQuery
  const graphqlConfig = global.config.graphql
  if (graphqlConfig !== undefined && graphqlConfig !== null && graphqlConfig.length > 0 && graphqlConfig[0].host !== '') {
    for (let i = 0; i < graphqlConfig.length; i++) {
      const enable = graphqlConfig[i].enable
      if (enable === undefined || enable) {
        const host = graphqlConfig[i].host
        const filePath = path.resolve(`./models/${host}`)
        const dbs = await loadFolderFiles(filePath, 'folder')
        // const dbs = graphqlConfig[i].dbs
        const hostSchema = await getOrmQuery(host, dbs)
        queryRoot.fields[host] = getFieldConfig(hostSchema)
      }
    }
  }
  return queryRoot
}
const createQuerySchema = async(rootConfig = {}) => {
  let queryRoot = getTypeConfig('Query')
  // 載入query目錄所有的查詢
  queryRoot = await loadQuery(queryRoot)
  queryRoot = await createOrmQuery(queryRoot)
  return getSchemaConfig('query', queryRoot, rootConfig)
}
// 1.3 載入
// -- Mutation --------
const createMutationSchema = async(rootConfig = {}) => {
  const mutationRoot = getTypeConfig('Mutation')
  // TODO: 實作mutation
  // return getSchemaConfig('mutation', mutationRoot, rootConfig)
  return rootConfig
}
// --------------------
const buildSchema = async() => {
  // 建立 query
  let schemaConfig = await createQuerySchema()
  // 建立 mutation
  schemaConfig = await createMutationSchema(schemaConfig)
  const schema = new graphql.GraphQLSchema(schemaConfig)
  return schema
}
module.exports = { buildSchema }

