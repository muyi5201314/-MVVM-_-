import { setAttr } from "../tool/setAttr.js"
import { setEvent } from "../tool/setEvent.js"
import { MYVUEFLAGES } from '../../data.js'

// 对比两个标签的动态属性
function compareAttr(oldTempVNode, newTempVNode) {
  let oldAttr = oldTempVNode.attr
  let newAttr = newTempVNode.attr
  for(let i = 0, attr_length = oldAttr.length; i < attr_length; i++) {
    switch(oldAttr[i].vueFlag) {
      case MYVUEFLAGES.CLASS:
        if(oldAttr[i].val !== newAttr[i].val) {
          oldTempVNode.elm.className = newAttr[i].val || ''
          oldAttr[i].val = newAttr[i].val
        }
        break
      case MYVUEFLAGES.STYLE:
        if(oldAttr[i].val !== newAttr[i].val) {
          oldTempVNode.elm.style = newAttr[i].val
          oldAttr[i].val = newAttr[i].val
        }
        break
      case MYVUEFLAGES.ATTR:
        if(oldAttr[i].val !== newAttr[i].val) {
          setAttr(oldTempVNode.elm, newAttr[i].key, newAttr[i].val)
          oldAttr[i].val = newAttr[i].val
        }
        break
      case MYVUEFLAGES.EVENT:
        if(oldAttr[i].val !== newAttr[i].val) {
          setEvent(oldTempVNode.elm, newAttr[i].key, newAttr[i].val)
          oldAttr[i].val = newAttr[i].val
        }
        break
      default:
        break
    }
  }
}

export {
  compareAttr
}