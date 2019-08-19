const { rootRequire, sinon, startServer } = require('../../tool')
const ORM = rootRequire('src/core/db/orm')
const { query, create, update, destroy, upsert } = rootRequire('src/core/db')
let server
const testDb = { // 測試連線資料
  host: 'dbLocal',
  db: 'api_sysdb',
  table: 'sample'
}
describe('[core/db/index]', () => {
  before((done) => {
    // 測試前需要執行的工作
    startServer({ socket: { enable: false }}).then(response => {
      server = response.server
      done()
    })
  })
  after((done) => {
    // 測試結束前需要執行的工作
    server.close()
    done()
  })
  it('1.1 db query:成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const result = await query({
      orm, table: testDb.table,
      params: {}
    })
    sinon.assert.match(Array.isArray(result.rows), true)
  })
  it('1.2 db create:成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const randomStr = Math.random()
    const result = await create({
      orm, table: testDb.table,
      values: {
        title: `title${randomStr}`,
        content: `content${randomStr}`,
        post: `new`,
        subkey: `id_${randomStr}`
      }
    })
    sinon.assert.match(result.dataValues.title, `title${randomStr}`)
  })
  it('1.3 db update:成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const randomStr = Math.random()
    const createResult = await create({
      orm, table: testDb.table,
      values: {
        title: `title${randomStr}`,
        content: `content${randomStr}`,
        post: `new`,
        subkey: `id_${randomStr}`
      }
    })
    const updateResult = await update({
      orm, table: testDb.table,
      params: { id: createResult.dataValues.id },
      vaules: { post: `update` }
    })
    sinon.assert.match(Array.isArray(updateResult), true)
  })
  it('1.4 db destroy:成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const randomStr = Math.random()
    const createResult = await create({
      orm, table: testDb.table,
      values: {
        title: `title${randomStr}`,
        content: `content${randomStr}`,
        post: `new`,
        subkey: `id_${randomStr}`
      }
    })
    const destroyResult = await destroy({
      orm, table: testDb.table,
      params: { id: createResult.dataValues.id }
    })
    sinon.assert.match(typeof destroyResult, 'number')
  })
  it('1.5 db upsert:成功', async() => {
    const orm = new ORM({ host: testDb.host, db: testDb.db })
    const randomStr = Math.random()
    const result = await upsert({
      orm, table: testDb.table,
      values: {
        title: `title${randomStr}`,
        content: `content${randomStr}`,
        post: `new`,
        subkey: `id_${randomStr}`
      }
    })
    sinon.assert.match(result, true)
  })
})
