import {
  getRouterInstanll
} from './router.js'
import routerSetting from './routerSetting.js'
import {
  createHistoryListener
} from './listen.js'

function initRouter() {
  const router = getRouterInstanll(routerSetting)
  // createHistoryListener()
  // window.addHistoryListener('history', function () {
  // //console.log(window.location.pathname);
  // router.entryRouter(window.location.pathname)
  // })
  // console.log(router.getRouterTemp());
}

export {
  initRouter
}