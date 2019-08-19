const { supertest, sinon, startServer } = require('../../../tool')
let api, server
const testDb = { // 測試連線資料
  host: 'dbLocal',
  db: 'api_sysdb',
  table: 'sample'
}
describe('API:[/sample/public/index]', () => {
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
  it('1.1 sample/text', (done) => {
    api.get('/sample/text')
      // .expect('Content-Type', /text/)
      .expect(200)
      .expect(res => {
        sinon.assert.match(res.text, 'text')
      })
      .end((err, response) => {
        if (err) return done(err)
        done()
      })
  })
  it('1.2 sample/json 測試', (done) => {
    api.get('/sample/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        sinon.assert.match(res.body.data.id, 'test')
      })
      .end((err, response) => {
        if (err) return done(err)
        done()
      })
  })
  it('1.3 sample/orm 測試', (done) => {
    api.get(`/sample/orm/${testDb.host}/${testDb.db}/${testDb.table}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        sinon.assert.match(Array.isArray(res.body.data), true)
      })
      .end((err, response) => {
        if (err) return done(err)
        done()
      })
  })
  it('1.4 sample/orm/schema 測試', (done) => {
    api.get(`/sample/orm/${testDb.host}/${testDb.db}/${testDb.table}/schema`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        sinon.assert.match(typeof res.body.data.column, 'object')
      })
      .end((err, response) => {
        if (err) return done(err)
        done()
      })
  })
})
