import { blockVNode, tagType } from "../../data.js"
import { getParentElm } from "./getParentElm.js"
import { insertAfter } from "./insertAfter.js"

// 获取Vnode前一个DOM
function getPreDom(vnode) {
  let beforeVNode = vnode.data.beforeVNode
  while(beforeVNode && blockVNode.elm instanceof DocumentFragment && beforeVNode.children.length === 0) {
    beforeVNode = beforeVNode.data.beforeVNode
  }
  let preDom = null
  if(beforeVNode) {
    switch(beforeVNode.type) {
      case tagType.element:
      case tagType.svg:
      case tagType.text:
        preDom = beforeVNode.elm
        break
      case tagType.v_for:
        preDom = beforeVNode.children[beforeVNode.children.length - 1].elm
        break
      case tagType.v_if:
        preDom = beforeVNode.children[0].elm
        break
      case tagType.component:
      case tagType.router:
        preDom = beforeVNode.children[beforeVNode.children.length - 1].elm
        break
    }
  }
  return preDom
}

// 将block区的节点挂到父DOM上
function mountBlock (vnode, targetElm) {
  // let brotherVNode = vnode.data.beforeVNode
  // while(brotherVNode && blockVNode.elm instanceof DocumentFragment && brotherVNode.children.length === 0) {
  //   brotherVNode = brotherVNode.data.beforeVNode
  // }
  // let parentNode = getParentElm(vnode)
  // if(brotherVNode) {
  //   switch(brotherVNode.type) {
  //     case tagType.element:
  //     case tagType.svg:
  //     case tagType.text:
  //       insertAfter(parentNode, targetElm, brotherVNode.elm)
  //       break
  //     case tagType.v_for:
  //       insertAfter(parentNode, targetElm, brotherVNode.children[brotherVNode.children.length - 1].elm)
  //       break
  //     case tagType.v_if:
  //       insertAfter(parentNode, targetElm, brotherVNode.children[0].elm)
  //       break
  //     case tagType.component:
  //     case tagType.router:
  //       insertAfter(parentNode, targetElm, brotherVNode.children[brotherVNode.children.length - 1].elm)
  //       break
  //   }
  // } else {
  //   insertAfter(parentNode, targetElm, null)
  // }
  let parentNode = getParentElm(vnode)
  let preDom = getPreDom(vnode)
  insertAfter(parentNode, targetElm, preDom)
}

export {
  mountBlock,
  getPreDom,
}