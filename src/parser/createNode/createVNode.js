import { quickMatch,bandEvent } from "../../utils/tool/quickMatch.js"
import { createNode } from "./createNode.js"
import { MYVUEFLAGES, tagType, VNode } from "../data.js"
import { currentDynamicNodes, currentStaticNodes, dynamicNodesStack } from "./data.js"
import { v_modelMatch } from "../../utils/tool/v_modelMatch.js"
import { isArray, isObject } from "../../utils/tool/typeJudge.js"

function createVNode(node, data) {
  let vnode
  // 动态节点生成并提取
  if(node.data.isDynamicNode) {
    vnode = new VNode({type: node.type, val: node.val, attr: node.attr, children:[], data: node.data, key: node.key, vueFlag: node.vueFlag})
    let currentDynamicNodes = dynamicNodesStack.get()
    // 动态文本节点
    currentDynamicNodes.push(vnode)
    if(vnode.type === tagType.text) {
      // 生成绑定关系
      let attrVal = quickMatch(vnode.val, data)
      if(isObject(attrVal) || isArray(attrVal)) {
        attrVal = JSON.stringify(attrVal)
        vnode.val = attrVal
      } else {
        vnode.val = attrVal
      }
    } else {
      for(let i = 0, attr_length = vnode.attr?.length; i < attr_length; i++) {
        if(vnode.attr[i].vueFlag && vnode.attr[i].key) {
          // 生成绑定关系
          if(vnode.attr[i].vueFlag === MYVUEFLAGES.EVENT) {
            // 绑定函数
            vnode.attr[i].val = bandEvent(vnode.attr[i].val, data)
          } else if(vnode.attr[i].vueFlag === MYVUEFLAGES.V_MODEL) {
            let attrVal = vnode.attr[i].val
            vnode.attr[i].v_modelVal = quickMatch(node.attr[i].val, data)
            vnode.attr[i].val = (event) => {
              v_modelMatch(attrVal, data, event.target.value)
            }
          } else {
            vnode.attr[i].val = quickMatch(node.attr[i].val, data)
          }
        }
      }
    }
  } else if(node.type === tagType.component || node.type === tagType.router) {
    vnode = new VNode({type: node.type, val: node.val, attr: node.attr, children:[], data: node.data, key: node.key, vueFlag: node.vueFlag})
    let currentDynamicNodes = dynamicNodesStack.get()
    // 动态文本节点
    currentDynamicNodes?.push(vnode)
  }
  // 子节点生成
  for(let i = 0, children_length = node.children.length; i < children_length; i++) {
    vnode.children.push(createNode(node.children[i], data))
  }
  return vnode
}

export {
  createVNode
}