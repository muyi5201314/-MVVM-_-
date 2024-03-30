// 判断是否为代理对象
function isProxy(proxy) {
  return proxy && proxy._is_proxy
}

export {
  isProxy
}