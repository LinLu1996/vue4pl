<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <!--<div class="brand-info">-->
          <!--<h2 class="brand-info__text">spl-ecoa-vue</h2>-->
          <!--<p class="brand-info__intro">spl-ecoa-vue基于vue、element-ui构建开发，实现spl-ecoa-vue后台管理前端功能，提供一套更优的前端解决方案。</p>-->
        <!--</div>-->
        <div class="login-main">
          <h3 class="login-title" style="color: #ffffff">
            <img style="width: 140px" src="../../assets/img/login-log.png" />
            <span style="display: inline-block;width: 2px;height: 40px;background: #ffffff;margin: 0 20px;vertical-align: middle"></span>
            <span>4PL承运平台</span>
          </h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" clearable placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="passWord">
              <!--<el-input type="password" style="position: fixed; bottom: -99999px"></el-input>-->
              <el-input v-model="dataForm.passWord" type="password" clearable placeholder="密码"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="10" :offset="2">
                <el-checkbox style="color: #ffffff" v-model="rememberPassword">记住密码</el-checkbox>
              </el-col>
              <el-col :span="6" :offset="6">
                <el-tooltip class="item" effect="light" content="请联系管理员" placement="right-end">
                  <span><router-link to="" style="color: #ffffff">忘记密码?</router-link></span>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <h4 style="color: #ffffff; text-align: center">Copyright 2019 国药集团医药物流有限公司. All Rights Reserved.</h4>
    </div>
    <update-password v-if="updatePasswordVisible" ref="updatePassword" @refreshDataList=""></update-password>
  </div>
</template>

<script>
  // import * as cookie from '../../utils/cookie'
  import UpdatePassword from './update-password'
  let Base64 = require('js-base64').Base64;
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          passWord: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          passWord: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: '',
        updatePasswordVisible: false,
        rememberPassword: false
      }
    },
    created () {
    },
    mounted () {
      this.loadAccountInfo();
    },
    components: {
      UpdatePassword
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        // 记住密码checkbox的勾选状态 和账号信息的字符串
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'userName': this.dataForm.userName,
                'password': this.dataForm.passWord
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                let visitType = Base64.encode(data.type + 'GUOYAO')
                this.$cookie.set('visitType', visitType)
                this.$store.commit('user/updateType', data.type);
                this.$router.replace({ path: '/home' })
                localStorage.removeItem('levelList')
                this.setAccountInfo()
              } else {
                if (data.flag) {
                  setTimeout(() => {
                    this.$message.error('密码为初始密码需修改密码后才能登陆')
                  }, 500)
                  this.updateHandle()
                } else {
                  this.$message.error(data.msg)
                }
              }
            })
          }
        })
      },
      // 修改密码
      updateHandle () {
        this.updatePasswordVisible = true
        let userName = this.dataForm.userName
        this.$nextTick(() => {
          this.$refs.updatePassword.init(userName)
        })
      },
      loadAccountInfo () {
        let cuserName = this.$cookie.get('userName');
        let cpassword = this.$cookie.get('password');
        this.dataForm.userName = cuserName;
        // 如果cookie里没有账号信息
        if (Boolean(cpassword) === false) {
          return false;
        } else  {
          // 如果cookie里有账号信息
          let depassword = Base64.decode(cpassword);
          let index = depassword.indexOf('GUOYAO');
          this.dataForm.passWord = depassword.substring(0, index);
          this.rememberPassword = true;
        }
      },
      setAccountInfo () {
        let accountInfo = {};
        accountInfo.name = this.dataForm.userName
        accountInfo.password = Base64.encode(this.dataForm.passWord + 'GUOYAO')
        if (this.rememberPassword) {
          this.$cookie.set('userName', accountInfo.name, 1440 * 3);
          this.$cookie.set('password', accountInfo.password, 1440 * 3);
        } else {
          this.$cookie.delete('password');
        }
        // 若为本地环境 则手写cookie
        // if (window.location.href.indexOf('localhost') !== -1) {
        //   this.$cookie.set('token', 'zhaopeng_58e0cbbea951f0e79fafcee80da522b8', 1440);
        // }
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 80%;
      width: 100%;
      display: flex;
      justify-content: space-around;
      /*align-items: center;*/
      background: transparent;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      /*position: fixed;*/
      /*top: 20%;*/
      /*right: 40%;*/
      padding: 20px;
      width: 440px;
      height: 320px;
      margin-top: 10%;
      background-color:rgba(0,0,0,0.5);
      border-radius: 5px;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 18px;
    }

  }
</style>
