module.exports = {
  name: 'hello',
  type: 'string',
  args: [
    { name: 'name', type: 'string' }
  ],
  resolve: (parent, { name, type }, context, info) => {
    return `hello !! ${name} type=${type}`
  }
}
