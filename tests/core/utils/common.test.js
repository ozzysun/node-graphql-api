const { rootResolve, rootRequire, sinon, startServer } = require('../../tool')
const { str2Obj, str2Array, jwtEncode, jwtDecode } = rootRequire('src/core/utils/common')
let server
describe('[core/utils/common]', () => {
  it('1.1 字串轉物件(str2Obj):', () => {
    const result = str2Obj('x=1&y=2')
    sinon.assert.match(result.x, 1)
  })
  it('1.2 字串轉陣列(str2Array) ', () => {
    const result = str2Array('a,b,c,d')
    sinon.assert.match(result[1], 'b')
  })
  it('1.3 取得絕對路徑(rootResolve) ', () => {
    const result = rootResolve('src')
    sinon.assert.match(typeof result, 'string')
  })
  it('1.4 jwt編碼與解碼(jwtDecode) ', () => {
    const token = jwtEncode({ x: 1, y: 2 }, 'default')
    const decodeData = jwtDecode(token, 'default')
    sinon.assert.match(decodeData.x, 1)
  })
})
