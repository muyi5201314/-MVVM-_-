import {encryption} from '../tool/encryption.js'

// 保存
function setSessionStorage(key, value, timeout = 7 * 24 * 3600) {
  if(isNaN(timeout) || timeout < 1) {
    //console.error('window.localStorage的时间错误');
  }
  let timeEnd = (new Date()).getTime() + timeout
  window.sessionStorage.setItem(key, 
    JSON.stringify(encryption(JSON.stringify({value: value, timeout: timeEnd}))))
}

// 获取
function getSessionStorage(key) {
  let item = window.sessionStorage.getItem(key)
  if(!item) {
    //console.warn(`window.localStorage中没有key为${key}的值`);
    return null
  }
  item = encryption(item)
  let nowTime = (new Date()).getTime()
  if(nowTime > item.timeout) {
    //console.warn(`window.localStorage中key为${key}的对象已超时`);
    removeSessionStorage(key)
    return null
  }
  return item.value
}

function removeSessionStorage(key) {
  if(window.sessionStorage.getItem(key)) {
    window.sessionStorage.removeItem(key)
  }
}

function clearSessionStorage() {
  window.sessionStorage.clear()
}

export{
  setSessionStorage, 
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
}