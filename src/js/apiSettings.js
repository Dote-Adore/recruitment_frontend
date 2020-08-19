const serviceModule = {
  // 登录
  userLogin: {
    url: '/user/login',

    method: 'post'
  },
  adminLogin: {
    url: '/admin/login',
    method: 'post'
  },
  companyLogin: {
    url: '/company/login',
    method: 'post'
  },
  userRegister: {
    url: '/user/register',
    method: 'post'
  },
  companyRegister: {
    url: 'company/register',
    method: 'post'
  },

}

const ApiSetting = {
  ...serviceModule
}

export default ApiSetting
