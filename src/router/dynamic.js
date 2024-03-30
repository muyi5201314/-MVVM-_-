import { Stack } from "../utils/tool/stack.js";
import {getLocalStorage} from '../utils/storage/localStorage.js'

// 全局钩子函数
const beforeLeave = new Stack(100)
const notFoundRegExp = /^\/404/
const loginRegExp = /^\/login/

function beforeEach(router, routerPath) {
  //console.log(routerPath);
  // //console.log(history.);
  //console.log(loginRegExp.test(routerPath));
  // 登录页面及404页面无需验证
  if(routerPath === '/' || notFoundRegExp.test(routerPath) || loginRegExp.test(routerPath)) {
    return true
  }

  // 未登录，禁止跳转
  // debugger
  if(!getLocalStorage('user')) {
    router.redirect('login')
    return false
  }

  return true
}

function afterEach() {
  return true
}

export {
  beforeLeave,
  beforeEach,
  afterEach
}