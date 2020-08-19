/* eslint-disable */
import axios from 'axios';
import qs from 'qs';
// import store from '@/store';
import router from '@/router';
// import {
//   setCookie,
//   delCookie
// } from '@/lib/common';
let cancel = {};
const promiseArr = {};
const CancelToken = axios.CancelToken;
// 请求拦截器
axios.interceptors.request.use((config) => {
  // 发起请求时，取消掉当前正在进行的相同请求
  if (config.url.indexOf('system') === -1 && promiseArr[config.url]) {
    promiseArr[config.url]('操作取消');
    promiseArr[config.url] = cancel;
  } else {
    promiseArr[config.url] = cancel;
  }
  // let token = store.getters.token;
  // for (let i = 0; i < 5; i++) {
  //   if (document.cookie.indexOf('token') > -1) {
  //     delCookie('token');
  //   } else {
  //     break;
  //   }
  // }
  // setCookie('token', token);
  // config.url = config.url + (config.url.indexOf('?') > -1 ? 'token=' : '?token=') + token;
  return config;
}, error => Promise.reject(error));

// 响应拦截器即异常处理
axios.interceptors.response.use(response => response, (error) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  if (error.message === '操作取消') {
    return false;
    // return Promise.reject(error);
  }
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求';
        break;
      case 401:
        store.commit('logout');
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          },
        });
        error.message = '未授权，请重新登录';
        break;
      case 403:
        error.message = '拒绝访问';
        break;
      case 404:
        error.message = '请求错误,未找到该资源';
        break;
      case 405:
        error.message = '请求方法未允许';
        break;
      case 408:
        error.message = '请求超时';
        break;
      case 500:
        error.message = '服务器端出错';
        break;
      case 501:
        error.message = '网络未实现';
        break;
      case 502:
        error.message = '网络错误';
        break;
      case 503:
        error.message = '服务不可用';
        break;
      case 504:
        error.message = '网络超时';
        break;
      case 505:
        error.message = 'http版本不支持该请求';
        break;
      default:
        error.message = `${error.response.status}`;
    }
  } else {
    error.message = '服务器连接失败';
  }
  return Promise.reject(error.message);
});

const httpServer = (opts, data) => {
  let id = sessionStorage.getItem("userid");
  let Public = {};
  if (id) {
    Public = { // 公共参数
      userId: id
    };
  }
  // const Public = { // 公共参数
  //   // _: new Date().getTime(),
  //   userid:
  // };
  let token = sessionStorage.getItem("token");

  const httpDefaultOpts = { // http默认配置

    method: opts.method,
    //默认地址
    // baseURL: 'https://www.ncutradingplatform.top/NCUTradingPlatform',
    baseURL: '/api',
    url: opts.url,
    timeout: 60000,
    params: Object.assign(Public, data),
    // withCredentials: true, // 允许携带cookie,但会影响本地跨域
    //data: data,
    data: qs.stringify(Object.assign(Public, data)),
    headers: opts.method === 'get' ? {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
    } : {
      Accept: '*/*',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;',

    },
    headers: {
      "token": token
    },
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  };

  if (opts.method === 'get') {
    delete httpDefaultOpts.data;
  } else {
    delete httpDefaultOpts.params;
  }

  const promise = new Promise(((resolve, reject) => {
    axios(httpDefaultOpts).then(
      (res) => {
        if (res.data) {
          if (res.data.errCode == "10001") {
            if (router.currentRoute.path !== '/login_h5') {
              router.replace({
                path: '/login_h5',
                query: {
                  redirect: router.currentRoute.fullPath
                },
              });
            }
          }
          resolve(res.data);
        } else if (res) {
          resolve(res);
        }
      },
    ).catch(
      (response) => {
        reject(response);
      },
    );
  }));
  return promise;
};

export default httpServer;
