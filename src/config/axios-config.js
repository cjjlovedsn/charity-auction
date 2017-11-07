import axios from 'axios'

axios.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  return config
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error)
  return Promise.reject(error)
})

// axios.defaults.baseURL = location.port === '8080' ? '/api' : ''

axios.install = (Vue) => {
  Vue.prototype.$http = axios
}

export default axios
