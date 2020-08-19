<template>
  <div>
    <div style="width:100%;position: fixed;top: 0;left: 0;z-index: -10;bottom: 0;right: 0; background-color: #f2f6fc"></div>
    <h1> 注册</h1>
    <div class="chooseType">
      <el-radio-group v-model="registerType">
        <el-radio-button label=0>我是社畜</el-radio-button>
        <el-radio-button label=1>我的资本家</el-radio-button>
      </el-radio-group>
    </div>
    <el-form  :model="inputForm" ref="inputForm" label-position="left" style="padding: 10px" status-icon :rules="rules"  label-width="80px"  >
      <el-form-item label="账户名" prop="account">
        <el-input  v-model="inputForm.account" autocomplete="off">
        </el-input>
      </el-form-item>
<!--      公司的一些信息-->
      <el-form-item v-if="registerType==1" prop="companyName" label="公司名称" >
        <el-input v-model="inputForm.companyName"></el-input>
      </el-form-item>
      <el-form-item v-if="registerType==1" prop="companyDescrip" label="公司简介" >
        <el-input type="textarea"  v-model="inputForm.companyDescrip"></el-input>
      </el-form-item>
      <el-form-item v-if="registerType==1" prop="companyUrl" label="官网链接" >
        <el-input v-model="inputForm.companyUrl"></el-input>
      </el-form-item>
      <el-form-item v-if="registerType==1" prop="compTele" label="客服电话" >
        <el-input v-model="inputForm.compTele"></el-input>
      </el-form-item>
<!---------------------->
<!--      个人注册时显示的信息-->
      <el-form-item v-if="registerType==0" prop="nickName" label="昵称" >
        <el-input v-model="inputForm.nickName"></el-input>
      </el-form-item>
<!--------------------->
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="inputForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="inputForm.checkPassword" ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="medium" style="width: 100%; margin-top:15px" :loading="btnLoading"  @click='register'>注册</el-button>
    <div class="register">已有帐户?
      <router-link to="./login" type="text"> 登录 </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data () {
    var confirmPsw = (rule, value, callback) => {
      if (this.inputForm.checkPassword === '') {
        callback(new Error('请确认密码！'))
      }
      else if (this.inputForm.password !== this.inputForm.checkPassword) {
        callback(new Error('两次输入的密码不一致！'))
      }
      else callback()
    }
    var checkAccount = (rule, value, callback) => {
      callback()
    }
    return {
      btnLoading: false,
      registerType: 0,
      inputForm: {
        account: 'bilibili',
        companyName: '哔哩哔哩',
        nickName: null,
        password: '123123123',
        checkPassword: '123123123',
        avatarUrl: null,
        companyDescrip: '哔哩哔哩干杯',
        companyUrl: 'www.bilibili.com',
        compTele: '15039298472'
      },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        password: [
          {required: true, message: '请输入密码！', trigger: 'blur'},
          { min: 8, max: 16, message: '密码限定在8-16个字符', trigger: 'blur' }
        ],
        checkPassword: [
          {required: true, message: '请输入确认密码！',trigger: 'blur'},
          { validator: confirmPsw, trigger: 'blur'}
        ],
        account: [
          {required: true, message: '请输入账户名', trigger: 'blur'},
          { validator: checkAccount, trigger: 'blur'}
        ],
        companyDescrip: [
          {required: true, message: '请输入公司简介', trigger: 'blur'}
        ],
        companyUrl: [
          {required: true, message: '请输入官网链接', trigger: 'blur'}
        ],
        compTele: [
          {required: true, message: '请输入客服电话', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    register () {
      var that = this
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          var datas = this.inputForm
          // 这里进行注册
          // 如果是普通用户

          if (this.registerType === 0) {
            this.$http(this.$api.userRegister,  {account: datas.account, nickname: datas.nickName, password: datas.password, avatarurl: null}).then(res =>{
              this.btnLoading = false
              if (res.code === -1) {
                this.$message.error(res.msg)
              } else if (res.code === 1) {
                this.$message.success(res.msg)
                this.$router.push('/login')
              }
            }, errorMsg => {
              this.btnLoading = false
              that.$message.error(errorMsg)
            })
            // 如果是企业用户
          } else {
            this.$http(this.$api.companyRegister, {
              account: datas.account,
              name: datas.companyName,
              password: datas.password,
              url: datas.companyUrl,
              description: datas.companyDescrip,
              tele: datas.compTele,
              avatarUrl: datas.avatarUrl}).then(res => {
              this.btnLoading = false
              if (res.data === false) {
                this.$message.error(res.msg)
                return
              }
              if (res.data === true) {
                this.$message.success(res.msg)
                this.$router.push('/login')
              }
            }, errorMsg => {
              this.btnLoading = false
              this.$message.error(errorMsg)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.chooseType{
  padding-top: 20px;
  padding-bottom: 20px;
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
