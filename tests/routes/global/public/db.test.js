const { supertest, sinon, startServer } = require('../../../tool')
let api, server
const testDb = { // 測試連線資料
  host: 'dbLocal',
  db: 'api_sysdb',
  table: 'sample'
}
describe('API:[/global/public/db]', () => {
  before((done) => {
    // 測試前需要執行的工作
    startServer({ socket: { enable: false }}).then(response => {
      server = response.server
      api = supertest(server)
      done()
    })
  })
  after((done) => {
    // 測試結束前需要執行的工作
    server.close()
    done()
  })
  it('1.1 db/:host/:db/:table查詢(get)成功', (done) => {
    api.get(`/global/db/${testDb.host}/${testDb.db}/${testDb.table}`)
      .expect(200)
      .expect(res => {
        sinon.assert.match(Array.isArray(res.body.data.rows), true)
      })
      .end((err, response) => {
        if (err) return done(err)
        done()
      })
  })
})
