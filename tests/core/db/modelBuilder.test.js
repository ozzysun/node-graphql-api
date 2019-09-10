const { rootRequire, sinon, startServer } = require('../../tool')
const { buildModel, writeCheckFile } = rootRequire('src/core/db/modelBuilder')
let server
describe('[core/db/modelBuilder]', () => {
  before((done) => {
    // 測試前需要執行的工作
    startServer({ socket: { enable: false }}).then(response => {
      server = response.server
      writeCheckFile() // 清除check file
      done()
    })
  })
  after((done) => {
    // 測試結束前需要執行的工作
    server.close()
    done()
  })
  it('1.1 建立model(buildModel):成功', async() => {
    const result = await buildModel('dbLocal', 'api_sysdb', ['sample'])
    // const result = await buildModel('dbTestMy', 'builder_sysdb', ['menutable'])
    sinon.assert.match(result, true)
  })
})
