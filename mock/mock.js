const Mock = require('mockjs')
const _ = require('lodash')
var Random = Mock.Random

function getSize () {
  return Math.round(Math.random() * 600) + 100
}
module.exports = function () {
  return {
    imgs: _.times(50, (n) => {
      var size = getSize() + 'x' + getSize()
      return {
        id: n,
        info: Random.csentence(10, 30),
        src: Random.image(size, Random.color())
      }
    }),
    comments: _.times(1000, (n) => {
      var id = Math.floor(n / 20)
      return {
        id: id,
        nickname: Random.cname(),
        content: Random.csentence(1, 200),
        comt_date: Random.date('yyyy-MM-dd hh:mm:ss'),
        bid: Math.round(Math.random() * 1000 + 100)
      }
    })
  }
}
