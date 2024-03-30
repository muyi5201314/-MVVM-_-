import { isBoolean } from "../../../utils/tool/typeJudge.js"

// 绑定、修改标签属性
function setAttr(elm, key, val) {
  if(key in elm) {
    if(isBoolean(elm[key]) && val === '') {
      elm[key] = true
    } else {
      elm[key] = val
    }
  } else {
    elm.setAttribute(key, val)
  }
}

export {
  setAttr
}