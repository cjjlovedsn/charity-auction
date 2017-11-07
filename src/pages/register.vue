<template>
    <div class="register">
      <div class="main">
        <mt-header title="注册" :style="{backgroundColor: '#138a5c'}"></mt-header>
        <div class="content">
          <mt-field type="text" label="用户名" v-model="username" placeholder="请输入用户名(非必填)"  :state="rules.username.state" @blur="validate('username')" @input="validate('username')"></mt-field>
          <mt-field :type="inputType" label="密码" placeholder="请输入密码(6-20位字母数字)" v-model="password" :state="rules.password.state" @blur="validate('password')" @input="validate('password')">
            <van-icon :name="viewPwd" v-tap="viewPassword"/>
          </mt-field>
          <mt-field :type="inputType" label="确认密码" placeholder="请再次输入密码" v-model="repeatPassword" :state="rules.repeatPassword.state" @blur="validate('repeatPassword')" @input="validate('repeatPassword')"></mt-field>
          <mt-field type="phone" label="手机号" placeholder="请输入您的手机号" v-model="phoneNumber" :state="rules.phoneNumber.state" @blur="validate('phoneNumber')" @input="validate('phoneNumber')"></mt-field>
        </div>
        <div class="footer clearfix">
          <router-link to="/login" class="regist-btn">返回登录</router-link>
          <mt-button type="primary" size="small" v-tap="submit">注册</mt-button>
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
        repeatPassword: '',
        phoneNumber: '',
        inputType: 'password',
        viewPwd: 'password-not-view',
        rules: {
          username: {
            reg: /^.+$/,
            state: ''
          },
          password: {
            reg: /^[a-zA-Z0-9]{6,20}$/,
            state: '',
            link: 'repeatPassword'
          },
          repeatPassword: {
            reg: /^[a-zA-Z0-9]{6,20}$/,
            state: '',
            link: 'password'
          },
          phoneNumber: {
            reg: /^1(3|4|5|7|8)\d{9}$/,
            state: ''
          }
        }
      }
    },
    methods: {
      validate (name) {
        let rule = this.rules[name]
        let value = this[name]
        let linkValue = rule.link ? this[rule.link] : ''
        console.log(linkValue)
        if (rule) {
          if (rule.link) {
            if (value && value === linkValue) {
              rule.state = 'success'
              this.rules[rule.link].state = 'success'
            } else {
              rule.state = 'error'
            }
          } else {
            if (rule.reg.test(value)) {
              rule.state = 'success'
            } else {
              rule.state = 'error'
            }
          }
        }
        return rule.state === 'success'
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
      cancel () {
        this.$emit('input', false)
      },
      submit () {
        let valide = true
        for (let k in this.rules) {
          valide = this.validate(k)
          if (!valide) {
            break
          }
        }
        if (valide) {
          this.$http.get('/index.php/auction/login/register', {
            params: {
              phone: this.phoneNumber,
              true_name: this.username,
              pwd1: this.password,
              pwd2: this.repeatPassword
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
              this.$router.replace('/')
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/config/global.styl'
  .register
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
