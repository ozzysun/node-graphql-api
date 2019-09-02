'use strict'
let useGraphql
const { buildSchema } = require('./schema')
const createGraphql = async() => {
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
    const schema = await buildSchema()
    const server = new ApolloServer({ schema, context, uploads: true })
    useGraphql = async(app) => {
      server.applyMiddleware({ app })
    }
    return useGraphql
  } catch (e) {
    console.log(`graphql error=`)
    console.log(e)
    useGraphql = async(app) => {
      console.log('[Warning]!! ...graphql is not exist')
    }
    return useGraphql
  }
}
module.exports = { createGraphql }
