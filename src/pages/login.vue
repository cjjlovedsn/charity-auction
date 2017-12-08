<template>
    <div class="login">
      <div class="main">
        <mt-header title="登录" :style="{backgroundColor: '#138a5c'}"></mt-header>
        <div class="content">
          <mt-field type="text" label="帐号" v-model="username" placeholder="请输入手机号" :state="rules.username.state"></mt-field>
          <mt-field :type="inputType" label="密码" v-model="password" placeholder="请输入密码" :state="rules.password.state">
            <van-icon :name="viewPwd" v-tap="viewPassword"/>
          </mt-field>
        </div>
        <div class="footer clearfix">
          <router-link to="/register" class="regist-btn">立即注册</router-link>
          <mt-button type="primary" size="small" v-tap="submit">登录</mt-button>
        </div>
      </div>
    </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default {
    name: 'login',
    data () {
      return {
        username: '',
        password: '',
        inputType: 'password',
        viewPwd: 'password-not-view',
        rules: {
          username: {
            reg: /^.+$/,
            state: ''
          },
          password: {
            reg: /^[a-zA-Z0-9]{6,20}$/,
            state: ''
          }
        }
      }
    },
    methods: {
      validate (name) {
        let rule = this.rules[name]
        let value = this[name]
        if (rule) {
          if (rule.reg.test(value)) {
            rule.state = 'success'
          } else {
            rule.state = 'error'
          }
        }
      },
      viewPassword () {
        if (this.viewPwd === 'password-view') {
          this.inputType = 'password'
          this.viewPwd = 'password-not-view'
        } else {
          this.inputType = ''
          this.viewPwd = 'password-view'
        }
      },
      submit () {
        let valide = Object.keys(this.rules).reduce((flag, name) => {
          this.validate(name)
          return flag && this.rules[name].state === 'success'
        }, true)
        if (valide) {
          this.$http.get('/index.php/auction/login/login', {
            params: {
              username: this.username,
              userpass: this.password
            }
          }).then(res => {
            let { success, rows } = res.data
            if (typeof rows === 'string') {
              Toast({
                message: rows,
                position: 'middle',
                duration: 2000
              })
            }
            if (success) {
              this.$router.replace(this.fromPath || '/')
            }
          })
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.path) {
          vm.fromPath = from.path
        }
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .login
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .main
      width: 700px;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      .footer
        padding: 40px 20px;
        width: 100%;
        text-align: right;
        .regist-btn
          float: left;
          line-height: 1.5;
          text-decoration: underline;
</style>
