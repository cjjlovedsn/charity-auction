const Mock = require('mockjs')
const path = require('path')
const glob = require('glob')
const moment = require('moment')
const _ = require('lodash')
var Random = Mock.Random

const imgPaths = glob.sync(path.join(__dirname, 'static/*.*')).map((name) => {
  return /\.(bmp|jpg|jpeg|gif|png)$/.test(name) ? `http://localhost:3000/${name.replace(/^.*[\\\/]/, '')}` : ''
})

module.exports = function () {
  return {
    auctionLists: _.times(10, (n) => {
      var eDate = new Date(Random.datetime())
      eDate.setYear(new Date().getFullYear())
      return {
        item_id: n,
        max_price: Random.integer(10, 10e3),
        owner_name: Random.cname(),
        visit_num: Random.integer(0, 1000),
        item_name: Random.csentence(5, 15),
        item_img_path: JSON.stringify([imgPaths[Random.integer(0, imgPaths.length - 1)]]),
        endtime: moment(eDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }),
    lists: _.times(10, (n) => {
      return {
        item_id: n,
        bid_date: Random.date('yyyy-MM-dd HH:mm:ss'),
        bid_price: Math.round(Math.random() * 1000 + 100),
        message: Random.csentence(10, 30),
        true_name: Random.cname(),
        username: Random.string('0123456789', 11)
      }
    }),
    noticeLan: [{
      'id': '14',
      'notice_content': '恭喜xxx，成功拍卖一个小魔仙！',
      'is_use': '1',
      'addtime': '2017-11-08 08:07:36'
    }],
    editAuctionLists: _.times(10, (n) => {
      var eDate = new Date(Random.datetime())
      eDate.setYear(new Date().getFullYear())
      return {
        item_id: n,
        max_price: Random.integer(10, 10e3),
        owner_name: Random.cname(),
        visit_num: Random.integer(0, 1000),
        item_name: Random.csentence(5, 15),
        item_img_path: JSON.stringify([imgPaths[Random.integer(0, imgPaths.length - 1)]]),
        endtime: moment(eDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }),
    visitAdd: {
      results: true,
      rows: null,
      success: true
    }
  }
}
