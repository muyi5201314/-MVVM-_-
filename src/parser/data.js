import { deepClone } from "../utils/tool/copy.js"

// 标签状态
const tagState = {
  // 标签开始
  start: 1,
  // 标签属性
  attr: 2,
  // 复杂标签属性
  complexAttr: 5,
  // 文本结点
  text: 3,
  // 标签结束
  end: 4,
  // 注释
  comment: 5
}

// 标签种类
const tagType = {
  // 路由页面
  router: 1,
  // 文本标签
  text: 2,
  // html标签
  element: 3,
  // 组件标签
  component: 4,
  // svg图标
  svg: 5,
  // v-if Block区
  v_if: 6,
  // v-for Block区
  v_for: 7,
}

// 自定义属性标记
const MYVUEFLAGES = {
  // @标记
  EVENT: 1,
  // :class标记
  CLASS: 2,
  // :style标记
  STYLE: 4,
  // :XXX标记
  ATTR: 8,
  // v-for标记
  V_FOR: 16,
  // v-if标记
  V_IF: 32,
  // v-model标记
  V_MODEL: 64,
  // {{xxx}}标记
  TEXT: 128,
  // key标记,用于缓存
  V_KEY: 256,
}

const blockVNode = {
  [tagType.router]: tagType.router,
  [tagType.component]: tagType.component,
  [tagType.v_if]: tagType.v_if,
  [tagType.v_for]: tagType.v_for,
}

// 标签类型快速匹配
const quichNodeTypeMatch = {
  // svg
  'svg': tagType.svg,
  // element
  'div': tagType.element,
  'p': tagType.element,
  'h1': tagType.element,
  'h2': tagType.element,
  'h3': tagType.element,
  'h4': tagType.element,
  'h5': tagType.element,
  'h5': tagType.element,
  'span': tagType.element,
  'br': tagType.element,
  'hr': tagType.element,
  'a': tagType.element,
  'img': tagType.element,
  'ol': tagType.element,
  'ul': tagType.element,
  'li': tagType.element,
  'table': tagType.element,
  'input': tagType.element,
  'button': tagType.element,
  'textarea': tagType.element,
  'i': tagType.element,
  'audio': tagType.element,
  'source': tagType.element,
  "label": tagType.element,
  'canvas': tagType.element,
  // router
  'router-view': tagType.router,
}

class VNode {
  /**
   * key 结点索引，用于快速判断两个结点是否相同(用于diff算法)
   * type 结点类型，必有，判断该节点属于常规结点还是特殊节点
   * val 结点名称，element标签名称或组件名称
   * data 保存特有数据
   * attr 结点属性，必有,element标签属性
   * elm 结点
   * children 子节点（vnode），必有
   */
  
  // node定义为{type, val, attr, children, data, key, vueFlag}
  constructor(node) {
    this.children = []
    // if(node.children) {
    //   this.children.push(...node.children)
    // }
    this.val = node.val
    this.type = node.type
    this.data = deepClone(node.data)
    this.attr = deepClone(node.attr)
    this.key = node.key
    this.vueFlag = node.vueFlag
  }
}

export {
  tagState,
  tagType,
  quichNodeTypeMatch,
  MYVUEFLAGES,
  blockVNode,
  VNode,
}