const { rootRequire, supertest, sinon, startServer } = require('../../tool')
const ORM = rootRequire('src/core/db/orm')
let server, api
const testDb = { // 測試連線資料
  host: 'dbLocal',
  db: 'api_sysdb',
  table: 'sample'
}
describe('[core/db/orm]', () => {
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
  it('1.1 建立orm取得model schema:成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const schema = await orm.schema(testDb.table)
    sinon.assert.match(typeof schema, 'object')
  })
  it('1.1.1 建立orm取得model schema:失敗', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const schema = await orm.schema('hello')
    // console.log(schema)
    sinon.assert.match(schema, null)
  })
  it('1.2 orm查詢(query):成功取得array', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const sqlStr = `select * from ${testDb.table}`
    const result = await orm.query(sqlStr).catch(e => {})
    sinon.assert.match(Array.isArray(result), true)
  })
  it('1.2.1 orm查詢(query):失敗取得null', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const sqlStr = `select * from ${testDb.table}xx`
    const result = await orm.query(sqlStr).catch(e => {})
    sinon.assert.match(result, null)
  })
  it('1.3 orm執行透過model執行(findAll):成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const model = await orm.model(testDb.table)
    const result = await model.findAll({ where: { post: 'new' }})
    sinon.assert.match(Array.isArray(result), true)
  })
})
