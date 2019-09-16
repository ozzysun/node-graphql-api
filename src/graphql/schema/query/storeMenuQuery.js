const getAsyncType = require('../types/storeMenu')
const storeMenuQuery = async() => {
  const storeMenu = await getAsyncType()
  return {
    name: 'storeMenuQuery',
    type: storeMenu,
    args: [
      { name: 'site', type: 'string' },
      { name: 'stock_no', type: 'string' }
    ],
    resolve: (parent, { site, stock_no }, context, info) => {
      return { site, stock_no }
    }
  }
}
module.exports = storeMenuQuery
