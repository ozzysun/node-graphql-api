const RouteClass = require('../../../core/RouteClass')
// const { query, create, update, destroy, upsert } = rootRequire('../../../core/db')
class Route extends RouteClass {
  routes() {
    this.get('hello', (req, res) => {
      this.json(res, req.config)
    })
  }
}
module.exports = Route
