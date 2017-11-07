import AlloyTouch from 'alloytouch'

function checkParam (binding) {
  if (typeof binding.value !== 'function') {
    throw new Error(`The param of directive "v-${binding.name}" must be a function!`)
  }
}

export default {
  install (Vue) {
    Vue.directive('tap', {
      inserted (touch, binding) {
        checkParam(binding)
        let alloyTouch = new AlloyTouch({
          touch,
          tap: binding.value
        })
        touch.alloyTouch = alloyTouch
      },
      unbind (el) {
        el.alloyTouch = null
      }
    })
    Vue.directive('longtap', {
      inserted (touch, binding) {
        checkParam(binding)
        let timer = null
        let alloyTouch = new AlloyTouch({
          touch,
          touchStart (e) {
            e.preventDefault()
            timer = setTimeout(() => {
              binding.value(e)
            }, 600)
          },
          touchEnd () {
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
          }
        })
        touch.alloyTouch = alloyTouch
      }
    })

    Vue.directive('drag', {
      inserted (touch, binding) {
        let move = false
        let disX = 0
        let disY = 0
        let timer = null
        let rec = touch.getBoundingClientRect()
        let r = document.body.clientWidth - rec.width
        let b = document.body.clientHeight - rec.height
        let alloyTouch = new AlloyTouch({
          touch,
          touchStart (e) {
            let target = e.touches[0]
            disX = target.clientX - touch.offsetLeft
            disY = target.clientY - touch.offsetTop
            timer = setTimeout(function () {
              move = true
            }, 200)
          },
          touchMove (e) {
            if (move) {
              e.preventDefault()
              let target = e.touches[0]
              let l = target.clientX - disX
              let t = target.clientY - disY
              if (l < 0) l = 0
              if (l > r) l = r
              if (t < 0) t = 0
              if (t > b) t = b
              touch.style.left = l + 'px'
              touch.style.top = t + 'px'
            }
          },
          touchEnd (e) {
            move = false
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
          }
        })
        touch.alloyTouch = alloyTouch
      }
    })

    Vue.component('v-longtap', {
      props: {
        tag: {
          type: String,
          default: 'div'
        },
        param: null,
        method: {
          type: Function
        },
        value: null,
        exclude: {
          type: String,
          default: '\\s'
        }
      },
      data () {
        return {
          touchStart: null
        }
      },
      mounted () {
        let self = this
        let timer = null
        let reg = new RegExp('(' + this.exclude + ')', 'i')
        this.alloyTouch = new AlloyTouch({
          touch: this.$el,
          touchStart (e) {
            if (!reg.test(e.target.tagName)) {
              e.preventDefault()
            }
            timer = setTimeout(() => {
              self.method(e, self.param)
            }, 600)
          },
          touchEnd () {
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
          }
        })
      },
      render (h) {
        return h(this.tag, this.$slots.default)
      }
    })
  }
}
