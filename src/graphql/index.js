'use strict'
let useGraphql
const schema = require('./schema')
try {
  const { ApolloServer } = require('apollo-server-express')
  // 透過contex 把req 或其他資訊傳進去
  const context = async({ req }) => {
    return req
    /*
    return {
      myProperty: true
    };
    */
  }
  // graphql upload 需node>8.5才能用
  // 先關閉 等node 升級再打開
  const server = new ApolloServer({ schema, context, uploads: true })
  useGraphql = (app) => {
    server.applyMiddleware({ app })
  }
} catch (e) {
  useGraphql = (app) => {
    console.log('Warning!! ...graphql is not exist')
  }
}
module.exports = { useGraphql }
