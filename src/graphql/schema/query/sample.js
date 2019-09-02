const User = require('../types/user')
const schemaData = {
  name: 'typeSample',
  type: User,
  args: [
    { name: 'name', type: 'string' }
  ],
  resolve: (parent, args, context, info) => {
    let response
    if (args.name === 'oz') {
      response = {
        name: 'oz',
        age: 30
      }
    } else {
      response = {
        name: 'nothing',
        age: 100
      }
    }
    return response
  }
}
module.exports = schemaData
