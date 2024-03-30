import {
  currentDynamicNodes, 
  currentStaticNodes, 
  dynamicNodesStack, 
  staticIndex, 
  staticIndexStack, 
  staticNodesStack 
} from "./data.js"

function createBlock(node, createFn) {
  // 开始新一轮的动态节点收集
  dynamicNodesStack.push([])

  //console.log(createFn);
  // 创建节点
  let vnode = createFn()

  // 动态节点赋值,比对的时候用
  vnode.dynamicNodes = dynamicNodesStack.get()

  // 当前数据已使用完,弹出
  dynamicNodesStack.pop()

  // 恢复上一级
  return vnode
}

export {
  createBlock
}

