const gulp = require('gulp')
const { argv } = require('yargs')
const { startServer } = require('../../src/app')
const { buildModel, writeCheckFile } = require('../../src/core/db/modelBuilder')
const process = require('process')
// const path = require('path')
// const { readYAML, writeYAML } = require('../../src/core/utils/file')
// const filePath = path.resolve('./conf/hosts.yml')
gulp.task('build-model', async() => {
  const args = getArgs()
  console.log('args===')
  console.log(args)
  writeCheckFile() // 清除check file
  if (args !== null) {
    await runBuild(args)
  } else {
    runPrompt()
  }
})
const getArgs = () => {
  if (argv.host === undefined || argv.db === undefined) return null
  const args = {
    host: argv.host,
    db: argv.db,
    table: argv.table === undefined ? [] : argv.table.split(','), // 沒有設定table則build全部, 多table 以,區分
    type: argv.type !== undefined ? argv.type : 'json' // 輸出格式 js|json 預設json
  }
  return args
}
const runPrompt = () => {
  console.log('ERROR!! 請設定要建立model的主機與db名稱參數 gulp build-model --host xxx --db xxx ')
}
const runBuild = async({ host, db, table, type = 'json' }) => {
  const { server } = await startServer()
  const result = await buildModel(host, db, table, type === 'json')
  server.close()
  console.log(`build model success = ${result} host=${host} db=${db} table=${table.join(',')}`)
  writeCheckFile()
  process.exit()
}
