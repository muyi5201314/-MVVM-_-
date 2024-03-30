import {decrypt, encryption} from '../tool/encryption.js'
// 保存
function setLocalStorage(key, value, timeout = 7 * 24 * 3600 * 1000) {
  // debugger
  // //console.log(globalThis);
  if(isNaN(timeout) || timeout < 1) {
    //console.error('localStorage的时间错误');
  }
  let timeEnd = (new Date()).getTime() + timeout
  window.localStorage.setItem(key, 
    JSON.stringify({value: value, timeout: timeEnd}))
}

// 获取
function getLocalStorage(key) {
  // //console.log(localStorage);
  let item = JSON.parse(window.localStorage.getItem(key))
  if(!item) {
    //console.warn(`localStorage中没有key为${key}的值`);
    return null
  }
  // item = atob(item)
  let nowTime = (new Date()).getTime()
  if(nowTime > item.timeout) {
    //console.warn(`localStorage中key为${key}的对象已超时`);
    removeLocalStorage(key)
    return null
  }
  return item.value
}

function removeLocalStorage(key) {
  if(window.localStorage.getItem(key)) {
    window.localStorage.removeItem(key)
  }
}

function clearLocalStorage() {
  window.localStorage.clear()
}

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
}
