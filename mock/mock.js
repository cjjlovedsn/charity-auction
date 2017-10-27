const Mock = require('mockjs')
const moment = require('moment')
const _ = require('lodash')
var Random = Mock.Random

function getSize () {
  return Math.round(Math.random() * 600) + 100
}
module.exports = function () {
  return {
    imgs: _.times(50, (n) => {
      var size = getSize() + 'x' + getSize()
      var src = 'http://192.168.12.74:3000/'
      var n = Math.ceil(Math.random() * 23)
      n = n > 9 ? n : '0' + n
      src += n + '.jpg'
      var eDate = new Date(Random.datetime())
      eDate.setYear(new Date().getFullYear())
      return {
        id: n,
        info: Random.csentence(10, 30),
        src: src,// Random.image(size, Random.color())
        title: Random.csentence(3, 10),
        price: `$${(Math.random() * 100 + 10).toFixed(2)}`,
        end_date: moment(eDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }),
    comments: _.times(1000, (n) => {
      var id = Math.floor(n / 20)
      return {
        id: id,
        nickname: Random.cname(),
        content: Random.csentence(1, 200),
        comt_date: Random.date('yyyy-MM-dd HH:mm:ss'),
        bid: Math.round(Math.random() * 1000 + 100)
      }
    })
  }
}
