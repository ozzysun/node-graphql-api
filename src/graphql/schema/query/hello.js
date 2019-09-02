module.exports = {
  name: 'hello',
  type: 'string',
  args: [
    { name: 'name', type: 'string' }
  ],
  resolve: (parent, args, context, info) => {
    return `hello !! ${args.name}`
  }
}
