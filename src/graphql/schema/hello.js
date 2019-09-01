
const schemaData = {
  name: 'firstName',
  config: {
    type: 'string',
    args: [
      { name: 'name', type: 'string' }
    ],
    resolve: (parent, args, context, info) => {
      return `[${args.name}]`
    }
  }
}
module.exports = schemaData
