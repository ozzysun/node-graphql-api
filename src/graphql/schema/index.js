const { getTypeConfig, getFieldConfig, createSchema } = require('../../core/graphql/util')
const { loadFolderFiles } = require('../../core/utils/file')
const { createOrmQuery } = require('./ormQuery')
const loadQuery = async(rootConfig) => {
  // 載入所有query目錄下的設定
  const filePath = `${global.dir.bin}/graphql/schema/query`
  const files = await loadFolderFiles(filePath, 'js', 'full')
  for (let i = 0; i < files.length; i++) {
    const querySchema = global.require2(files[i]) // 取得query設定
    rootConfig.fields[querySchema.name] = getFieldConfig(querySchema) // 產生query並設定到root fields下
  }
  return rootConfig
}
const buildSchema = async() => {
  let rootConfig = getTypeConfig('Query')
  // 載入query目錄所有的查詢
  rootConfig = await loadQuery(rootConfig)
  // 加入 指定 db 的ormQuery
  const graphqlConfig = global.config.graphql
  if (graphqlConfig !== undefined && graphqlConfig !== null && graphqlConfig.length > 0 && graphqlConfig[0].host !== '') {
    for (let i = 0; i < graphqlConfig.length; i++) {
      const host = graphqlConfig[i].host
      const dbs = graphqlConfig[i].dbs
      const hostSchema = await createOrmQuery(host, dbs)
      rootConfig.fields[host] = getFieldConfig(hostSchema)
    }
  }
  const schema = createSchema(rootConfig)
  return schema
}
module.exports = { buildSchema }

