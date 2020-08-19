<template>
  <div>
    <div style="width:100%;position: fixed;top: 0;left: 0;z-index: -10;bottom: 0;right: 0; background-color: #f2f6fc"></div>
    <div class="title" style="font-size:23px;margin-bottom: 30px;padding-top:40px">
      <span v-if="userType===0">找个工作-我是社畜</span>
      <span v-if="userType===1">找个社畜-我是资本家</span>
      <span v-if="userType===2">收广告费-我是管理员</span>
    </div>
    <el-card class="login-card">
      <div class="login-place">用户名</div>
      <el-input v-model="uid" class="login-input"></el-input>
      <div class="login-place">密码</div>
      <el-input v-model="password" class="login-input" show-password></el-input>
      <el-checkbox style="float: left" v-model="autoLogin">自动登录</el-checkbox>
      <el-button type="primary" size="medium" style="width: 100%; margin-top:15px" :loading="btnLoading" @click="toLogin(userType)">登录</el-button>
    </el-card>
    <div class="register">没有帐户?
      <router-link to="./register" type="text"> 注册一个 </router-link>
    </div>
    <el-button v-if="userType===1||userType==2" type="primary" plain size="medium" :loading="btnLoading" @click="changeLoginType(0)">我是社畜</el-button>
    <el-button v-if="userType===0||userType==2" type="primary" plain size="medium" :loading="btnLoading" @click="changeLoginType(1)">我是资本家</el-button>
    <el-button v-if="userType===0||userType==1" type="primary" plain size="medium" :loading="btnLoading" @click="changeLoginType(2)">我是管理员</el-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      windowHeight: window.innerHeight,
      autoLogin: true,
      uid: '',
      password: '',
      btnLoading: false,
      // 0是普通社畜，1是资本家，2是管理员
      userType: 0
    }
  },
  methods: {
    // 按下登录按钮
    toLogin (type) {
      // 判断是不是符合条件
      if (this.uid === '') {
        this.$message.warning('请输入用户名')
        return
      }
      if (this.password === '') {
        this.$message.warning('请输入密码')
        return
      }
      var that = this
      // 根据当前选择的登录，选择对应的后端api，因为其data内容相同，所以可以这样做
      this.btnLoading = true
      var loginApi = this.$api.userLogin
      if (this.userType === 1)
        loginApi = this.$api.companyLogin
      if (this.userType === 2)
        loginApi = this.$api.adminLogin

      this.$http(loginApi, {account: this.uid, password: this.password}).then(res => {
        // 回调
        this.btnLoading = false
        if (res.code === -1) {
          that.$message.error('用户名或密码错误,请重试！')
        } else {
          this.$message.success('登录成功！')
          window.localStorage.setItem('userInfo', JSON.stringify(res.data))
          window.localStorage.setItem('uid', res.data.uid)
          // 登录成功后页面转到这里，这里还没做，也可以根据不同的用户转向不同的界面
          that.$router.push('/app')
        }
        // 其他错误
      }, errorMsg => {
        this.btnLoading = false
        that.$message.error(errorMsg)
      })
    },
    changeLoginType (val) {
      this.userType = val
    }
  },
  mounted () {
    var that = this
    window.onresize = () => {
      return (() => {
        that.windowHeight = window.innerHeight
      })()
    }
    console.log('change')
  },
  beforeCreate () {
    this.windowHeight = window.innerHeight
  }
}
</script>

<style scoped>
.login-card{
  width: 320px;
  margin: auto;
  border-radius: 10px;
  position: relative;
  padding: 7px;
}
  .login-input{
    margin: 10px 0 10px 0;
  }
  .login-place{
    text-align: left;
    font-weight: bold;
    font-size: 14px;
  }
  .register{
    width: 320px;
    margin: auto;
    padding:10px;
    border-radius: 10px;
    z-index: 10;
    margin-top:10px;
    border-style: solid;
    border-width: 1px;
    border-color: #e4e7ed;
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
