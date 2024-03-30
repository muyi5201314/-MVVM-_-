import { isUndefined } from "../../../../utils/tool/typeJudge.js"
import { createNodes } from "../../mount/createNodes/createNodes.js"
import { getParentElm } from "../../tool/getParentElm.js"
import { mountBlock } from "../../tool/mountBlock.js"
import { unMount } from "../../unMount/unMount.js"
import { compareAttr } from "../compareAttr.js"
import { patch } from "../patch.js"

function patchV_if(oldVNode, newVNode) {
  let parentNode = getParentElm(oldVNode)
  // 对比父节点属性
  compareAttr(oldVNode, newVNode)
  // 原分支不存在
  if(isUndefined(oldVNode.data.v_ifSelectIndex)) {
    // 现分支存在，直接挂载
    if(newVNode.data.v_ifSelectIndex !== undefined) {
      let elm = createNodes(newVNode, parentNode)
      // oldVNode.data.v_ifSelectIndex = newVNode.data.v_ifSelectIndex
      // oldVNode.children = newVNode.children
      // oldVNode.elm = elm
      // oldVNode.dynamicNodes
      Object.assign(oldVNode, newVNode)
      mountBlock(oldVNode, oldVNode.elm)
    }
  } else { //原分支存在
    // 现分支不存在，直接卸载
    if(isUndefined(newVNode.data.v_ifSelectIndex)) {
      unMount(oldVNode.children[0], parentNode)
      oldVNode.children.length = 0
      oldVNode.data.v_ifSelectIndex = undefined
      // 现分支存在，并且和先分支为同一个分支，直接比对
    } else if(oldVNode.data.v_ifSelectIndex === newVNode.data.v_ifSelectIndex) {
      patch(oldVNode, newVNode)
    } else {
      // 现分支存在，但是与原分支不为同一个分支，先卸载原分支再挂载现分支
      unMount(oldVNode.children[0], parentNode)
      let elm = createNodes(newVNode, parentNode)
      // oldVNode.data.v_ifSelectIndex = newVNode.data.v_ifSelectIndex
      // oldVNode.children = newVNode.children
      // // oldVNode.elm.appendChild(oldVNode.children[0].elm)
      // oldVNode.elm = elm
      Object.assign(oldVNode, newVNode)
      mountBlock(oldVNode, oldVNode.elm)
    }
  }
}

export {
  patchV_if
}