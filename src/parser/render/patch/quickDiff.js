import { findLenSonArray } from "../../../utils/tool/findLenSonArray.js"
import { getPreDom, mountBlock } from "../tool/mountBlock.js"
import { createNodes } from "../mount/createNodes/createNodes.js"
import { unMount } from "../unMount/unMount.js"
import { patch } from "./patch.js"
import { getParentElm } from "../tool/getParentElm.js"
import { insertAfter } from "../tool/insertAfter.js"
import { isObject, isUndefined } from "../../../utils/tool/typeJudge.js"
import { tagType } from "../../data.js"
import { exitNewNodeTrigger, newNodeTrigger } from "../../reactive/proxy.js"

// 将旧虚拟vnode的DOm移入到新虚拟vnode
function quickOver(oldVNode, newVNode) {
  // debugger
  newVNode.elm = oldVNode.elm
  for(let i = 0, children_length = newVNode.children.length; i < children_length; i++) {
    // if(newVNode.children[i].tyle === tagType.)
    switch(newVNode.children[i].type) {
      case tagType.element:
      case tagType.svg:
      case tagType.text:
        quickOver(oldVNode.children[i], newVNode.children[i])
        break
      case tagType.router:
      case tagType.component:
      case tagType.v_for:
      case tagType.v_if:
        Object.assign(newVNode.children[i], oldVNode.children[i])
        break
      default:
        break
    }
  }
}

// 快速diff算法
function quickDiff(oldVNode, newVNode) {
  // debugger
  let oldVNodeChildren = oldVNode.children, newVNodeChildren = newVNode.children
  let start = 0, oldEnd = oldVNodeChildren.length - 1, newEnd = newVNodeChildren.length - 1
  let parentNode = getParentElm(oldVNode)
  // 消除前置节点
  // debugger
  while(start <= oldEnd && start <= newEnd && oldVNodeChildren[start].key === newVNodeChildren[start].key) {
    patch(oldVNodeChildren[start], newVNodeChildren[start])
    quickOver(oldVNodeChildren[start], newVNodeChildren[start])
    start++
  }
  // 消除后置节点
  while(oldEnd >= start && newEnd >= start && oldVNodeChildren[oldEnd].key === newVNodeChildren[newEnd].key) {
    patch(oldVNodeChildren[oldEnd], newVNodeChildren[newEnd])
    quickOver(oldVNodeChildren[oldEnd], newVNodeChildren[newEnd])
    oldEnd--
    newEnd--
  }
  let tempDom
  // 新虚拟DOM多余，需要挂载
  if(start > oldEnd) {
    if(oldVNodeChildren.length) {
      // 获取参照DOM
      if(start === 0) {
        tempDom = oldVNodeChildren[start - 1].elm
      } else {
        tempDom = getPreDom(oldVNode)
      }
    } else {
      tempDom = getPreDom(oldVNode)
    }
    for(let i = start; i <= newEnd; i++) {
      let dom = createNodes(newVNodeChildren[i])
      insertAfter(parentNode, dom, tempDom)
      tempDom = dom
    }
    return
  }
  // 旧虚拟DOM多余，需要卸载
  if(start > newEnd) {
    for(let i = start; i <= oldEnd; i++) {
      unMount(oldVNodeChildren[i], parentNode)
    }
    return
  }
  let newVNodeMap = {}
  let count = newEnd - start + 1, index, needDiff = false, pos = 0
  let source = new Array(count).fill(-1)
  // 建立新虚拟DOM的索引表
  for(let i = start; i <= newEnd; i++) {
    newVNodeMap[newVNodeChildren[i].key] = i
  }
  // debugger
  for(let i = start; i <= oldEnd; i++){
    index = undefined
    index = newVNodeMap[oldVNodeChildren[i].key]
    // 建立新旧虚拟DOM的位置关系
    // 新DOM的index --> 旧DOM的index
    if(!isUndefined(index)) {
      source[index - start] = i
      if(index < pos) {
        needDiff = true
      } else {
        pos = index
      }
    } else {
      // 新虚拟DOM不存在该节点，该节点需要被卸载
      unMount(oldVNodeChildren[i], parentNode)
    }
  }
  // debugger
  let preDom = getPreDom(oldVNode)
  // 旧节点需要被移动
  if(needDiff) {
    // 获取最长递增子序列下标数组
    const seq = findLenSonArray(source).indexArray
    // // 获取insertBefore的目标节点
    // if(oldVNodeChildren.length) {
    //   if(oldEnd === oldVNodeChildren.length - 1){
    //     tempDom = oldVNodeChildren[oldEnd].elm.nextSibling
    //   } else {
    //     tempDom = oldVNodeChildren[oldEnd + 1].elm
    //   }
    // } else {
    //   // 原
    //   let brotherVNode = vnode.data.brotherVNode
    //   while(brotherVNode && blockVNode.elm instanceof DocumentFragment && brotherVNode.children.length === 0) {
    //     brotherVNode = brotherVNode.data.beforeVNode
    //   }
    //   if(brotherVNode) {
    //     tempDom = brotherVNode.elm.nextSibling
    //   } else {
    //     // 该
    //   }
    // }
    let s = 0, i = 0, source_length = source.length, seq_length = seq.length
    while(i < source_length) {
      // 新虚拟DOM不存在，需要挂载
      if(source[i] === -1) {
        let dom = createNodes(newVNodeChildren[start + i])
        insertAfter(parentNode, dom, preDom)
        preDom = dom
        i++
      } else if(s < seq_length && i !== seq[s]) {
        // 节点需要更换位置
        patch(oldVNodeChildren[source[i]], newVNodeChildren[i])
        let dom = oldVNodeChildren[source[i]].elm
        insertAfter(parentNode, dom, preDom)
        quickOver(oldVNodeChildren[source[i]], newVNodeChildren[i])
        preDom = dom
        i++
      } else {
        // 节点不需要更换位置
        patch(oldVNodeChildren[source[i]], newVNodeChildren[i])
        quickOver(oldVNodeChildren[source[i]], newVNodeChildren[i])
        preDom = dom
        i++
        s++
      }
    }
  } else {
    // 旧节点不需要移动，直接添加新虚拟DOM中的节点
    for(let i = 0, source_length = source.length; i < source_length; i++) {
      if(source[i] === -1) {
        let dom = createNodes(newVNodeChildren[start + i])
        insertAfter(parentNode, dom, preDom)
        preDom = dom
      } else {
        patch(oldVNodeChildren[source[i]], newVNodeChildren[i])
        quickOver(oldVNodeChildren[source[i]], newVNodeChildren[i])
        // 维护preDom
        preDom = dom
      }
    }
  }
}

export {
  quickDiff
}