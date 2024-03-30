// 绑定、修改、卸载event
function setEvent(elm, key, val) {
  let eventMap = elm._eventMap ?? (elm._eventMap = {})
  let event = eventMap[key]
  if(val) {
    if(event) {
      event.value = val
    } else {
      let fn = (e) => {
        fn.value(e)
      }
      fn.value = val
      elm.addEventListener(key, fn)
      eventMap[key] = fn
    }
  } else {
    elm.removeEventListener(key, event)
    eventMap[key] = undefined
  }
}

export {
  setEvent
}