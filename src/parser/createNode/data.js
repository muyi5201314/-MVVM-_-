import { getRouterInstanll } from "../../router/router.js"
import { Stack } from "../../utils/tool/stack.js"

// 当前动态节点
let currentDynamicNodes
// 递归保存当前动态节点
const dynamicNodesStack = new Stack()

// 当前静态节点
let currentStaticNodes
// 递归保存当前静态节点
const staticNodesStack = new Stack()
// 全局静态节点库,这里可能有内存泄漏问题
const staticNodesMap = new Map()
// 当前的静态节点位置
let staticIndex = 0
// 递归保存当前静态位置
const staticIndexStack = new Stack()

// 当前的组件对应表
let currentComponents
// 递归保存组件对应表
const componentsStack = new Stack()

export {
  currentDynamicNodes,
  dynamicNodesStack,
  currentStaticNodes,
  staticNodesStack,
  staticNodesMap,
  staticIndex,
  staticIndexStack,
  currentComponents,
  componentsStack,
}