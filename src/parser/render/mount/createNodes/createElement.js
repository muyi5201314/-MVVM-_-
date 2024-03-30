import { setAttr } from "../../tool/setAttr.js"
import { setEvent } from "../../tool/setEvent.js"
import { createNodes } from "./createNodes.js"

// 创建html结点
function createElement(vnode, container) {
  // 创建element节点
  let dom
  if(vnode.elm) {
    //console.log(vnode.elm);
    dom = vnode.elm
  } else {
    dom = vnode.elm = document.createElement(vnode.val)
    if(vnode.attr) {
      for(let item of vnode.attr) {
        if(item.key) {
          if(item.key.startsWith('on')) {
            // 创建监听器
            setEvent(dom, item.key.slice(2), item.val)
          } else if (item.key === 'v-model'){
            // 赋初值
            vnode.elm.value = item.v_modelVal
            setEvent(vnode.elm, 'input', item.val)
          } else {
            setAttr(vnode.elm, item.key, item.val)
          }
        }
      }
    }
  }
  let beforeVNode = null
  for(let i=0, children_length = vnode.children.length; i < children_length ;i++) {
    dom.appendChild(createNodes(vnode.children[i], dom, beforeVNode))
    beforeVNode = vnode.children[i]
  }
  return vnode.elm
}

export {
  createElement
}