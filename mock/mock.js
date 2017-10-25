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
    })
  }
}
