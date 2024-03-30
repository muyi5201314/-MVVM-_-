import { setEvent } from "../tool/setEvent.js"

// 清除事件
function removeEvent(vnode) {
  let dynamicNodes = vnode.dynamicNodes, dynamicNodeAttr
  // 清除dom上的绑定事件
  if(dynamicNodes) {
    for(let i=0, dynamicNodes_length = dynamicNodes.length; i < dynamicNodes_length; i++) {
      let eventMap = dynamicNodes[i].elm._eventMap
      // debugger
      if(eventMap) {
        let eventKeys = Object.keys(eventMap)
        for(let i=0, eventKeys_length = eventKeys.length; i < eventKeys_length; i++) {
          setEvent(dynamicNodes[i].elm, eventKeys[i], null)
        }
      }
      if(dynamicNodes[i].elm.prototype === DocumentFragment) {
        removeEvent(dynamicNodes[i])
      }
    }
  }
}

// 清除DOM
function removeDOM(vnode, container) {
  if(vnode.elm instanceof DocumentFragment) {
    for(let i = 0, children_length = vnode.children.length; i < children_length; i++) {
      let childVNode = vnode.children[i]
      if(childVNode.elm instanceof DocumentFragment) {
        removeDOM(childVNode, container)
        continue
      }
      container.removeChild(childVNode.elm)
    }
  } else {
    // debugger
    container.removeChild(vnode.elm)
  }
}

// 卸载
function unMount(vnode, container) {
  // removeEvent(vnode)
  removeDOM(vnode, container)
}

export {
  unMount
}