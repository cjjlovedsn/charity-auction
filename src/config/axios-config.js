import axios from 'axios'

const msg = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

const flagElement = document.querySelector('#flag') || {}
const flag = isNaN(parseInt(flagElement.value)) ? !1 : !parseInt(flagElement.value)
const tokenElement = document.querySelector('#token') || {}

function sendEmail (error) {
  if (error && error.response) {
//  let status = error.response.status
//  let config = error.config
//  let resData = error.response.data || ''
//  if (status === 500) {
//    if (config.url.search('sendEmail') < 0) {
//      let data = JSON.stringify(config.params)
//      let arr = resData.match(/((?:<h2 class="block_exception clear_fix">)(.|\n|\s)*?(?:<\/h2>))/g)
//      let str = ''
//      if (arr instanceof Array) {
//        str = arr.reduce(function (acc, item) {
//          return acc + item + '<br />'
//        })
//      }
//      let errText = `<style>.block_exception{background-color:#ddd;color:#333;padding:20px;-webkit-border-top-left-radius:16px;-webkit-border-top-right-radius:16px;-moz-border-radius-topleft:16px;-moz-border-radius-topright:16px;border-top-left-radius:16px;border-top-right-radius:16px;border-top:1px solid #ccc;border-right:1px solid #ccc;border-left:1px solid #ccc;overflow:hidden;word-wrap:break-word}.exception_title{display: block;}.exception_title a{color: #868686}.exception_message{}.container {font: 700 14px "微软雅黑";}.container h4 {display: inline-block;font-size: 14px}.container span {color: #F84D05;}.block_exception span{color: #333;}</style>
//      <div class="container">
//      <h4>页面标题：</h4>
//      <span>微信端口碑分析</span>
//      <br />
//      <h4>错误类型：</h4>
//      <span>${status}</span>；
//      <br />
//      <h4>接口地址：</h4>
//      <span>${config.url}</span>；
//      <br />
//      <h4>参数：</h4>
//      <span>${data}</span>；
//      <br />
//      <h4>错误信息：</h4>
//      <div>${str}</div>；
//      <br />
//      </div>`
//      axios.post('/sendEmail/sendEmail', {
//        url: '<a href="' + location.href + '" style="color:#F84D05">' + location.href + '</a>',
//        error: errText
//      }).then(res => {
//        console.log('sendEmail:', res)
//      }).catch(err => {
//        console.log('sendEmail Error: ', err)
//      })
//    }
//  }
    return msg[status]
  }
  return error.message || ''
}

axios.interceptors.request.use((config) => {
  if (config.method === 'post' && config.params) {
    config.params._token = tokenElement.value
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  return config
})

axios.interceptors.response.use(function (response) {
  if (flag && (response.config.url.search('userhotel_info') < 0)) {
    response.data.success = false
    response.data.rows = '途途这就去为您准备数据,敬请期待......'
  }
  return response
}, function (error) {
  error.message = sendEmail(error)
  return Promise.reject(error)
})

axios.defaults.baseURL = location.port === '8080' ? '/api' : ''

axios.install = (Vue) => {
  Vue.prototype.$http = axios
}

export default axios
