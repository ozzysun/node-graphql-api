const RouteClass = require('../../../core/RouteClass')
const { query, create, update, destroy } = require('../../../core/db')
const { buildModel, writeCheckFile } = require('../../../core/db/modelBuilder')
class Route extends RouteClass {
  routes() {
    this.get('db/:host/:db/:table', async(req, res) => {
      const orm = this.orm({ host: req.params.host, db: req.params.db })
      const queryResult = await query({
        orm, table: req.params.table,
        attributes: req.query.attributes,
        page: req.query.page,
        perPage: req.query.perPage,
        params: {}
      })
      this.json(res, queryResult)
    })
    this.post('db/:host/:db/:table', async(req, res) => {
      const orm = this.orm(req.params.host, req.params.db)
      const createResult = await create({
        orm, table: req.params.table,
        values: req.body.values
      })
      this.json(res, createResult.dataValues)
    })
    this.put('db/:host/:db/:table', async(req, res) => {
      const orm = this.orm({ host: req.params.host, db: req.params.db })
      const queryResult = await update({
        orm, table: req.params.table,
        values: req.body.values
      })
      this.json(res, { rowNum: queryResult })
    })
    this.delete('db/:host/:db/:table', async(req, res) => {
      const orm = this.orm({ host: req.params.host, db: req.params.db })
      const result = await destroy({
        orm, table: req.params.table,
        params: req.body.params
      })
      this.json(res, { rowNum: result })
    })
    this.get('model/build/:host/:db', async(req, res) => {
      const host = req.params.host
      const db = req.params.db
      const result = await buildModel(host, db)
      console.log(`build model success = ${result} host=${host} db=${db}`)
      writeCheckFile()
      this.json(res, { rowNum: result })
    })
  }
}
module.exports = Route
