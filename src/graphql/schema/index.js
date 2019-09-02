const { getTypeConfig, getFieldConfig, createSchema } = require('../../core/graphql/util')
const { loadFolderFiles } = require('../../core/utils/file')
const loadQuery = async(rootConfig) => {
  // 載入所有query目錄下的設定
  const filePath = `${global.dir.bin}/graphql/schema/query`
  const files = await loadFolderFiles(filePath, 'js', 'full')
  for (let i = 0; i < files.length; i++) {
    const querySchema = global.require2(files[i])
    rootConfig.fields[querySchema.name] = getFieldConfig(querySchema)
  }
  return rootConfig
}
const buildSchema = async() => {
  let rootConfig = getTypeConfig('Query')
  // 載入query目錄所有的查詢
  rootConfig = await loadQuery(rootConfig)
  const schema = createSchema(rootConfig)
  return schema
}
module.exports = { buildSchema }

