import { isUndefined } from "../../../utils/tool/typeJudge.js"
import { MYVUEFLAGES, tagType } from "../../data.js"
import { lexicalPaser, syntaxInit, traverseVueFlag } from "../../paser/index.js"
import { createProxy, createWatherBox, deleteTempTargetWatcher, exitWatcherBox, saveTempTargetWatcher, Watcher } from "../../reactive/proxy.js"
import { render } from "../../render/index.js"
import { createBlock } from "../createBlock.js"
import { createNode } from "../createNode.js"
import { componentsStack } from "../data.js"

// 创建组件
function createComponent(vnode) {
  createWatherBox(null)
  const component = componentsStack.get()[vnode.val]
  if(!component) {
    throw new Error(`不存在组件${vnode.val}`)
  }
  let props = Object.assign({}, component.props)
  const emits = {}
  const methods = {}
  for(let i = 0, attr_length = vnode.attr?.length; i < attr_length; i++) {
    if(vnode.attr[i].key) {
      // 生成绑定关系
      if(vnode.attr[i].vueFlag === MYVUEFLAGES.EVENT) {
        // 绑定函数
        let sliceKey = vnode.attr[i].key.slice(2)
        if(component.emits?.has(sliceKey)) {
          emits[sliceKey] = vnode.attr[i].val
          // 这条event是子组件emit属性，删除该属性
          vnode.attr[i].key = null
        }
      } else {
        if(component.props.hasOwnProperty(vnode.attr[i].key)) {
          props[vnode.attr[i].key] = vnode.attr[i].val
          // 这条动态属性是子组件props属性，删除该属性
          vnode.attr[i].key = null
        } else {
          vnode.attr[i].val = vnode.attr[i].val
        }
      }
    }
  }
  // 合并method,props,emits到data中
  let componentData = component.data()
  Object.assign(componentData, {props})
  // 触发生命周期beforeCreate
  component.methods.beforeCreate && component.methods.beforeCreate.apply(componentData)
  // 数据代理
  const proxyData = createProxy(componentData)
  // debugger
  Object.assign(componentData, {emits})
  // 代理方法
  if(component.methods) {
    const keys = Object.keys(component.methods)
    for(let key of keys) {
      methods[key] = new Proxy(component.methods[key], {
        apply: function(target, thisArg, argumentsList) {
          target.apply(proxyData, argumentsList)
        },
      })
    }
  }
  // Object.assign(componentData, methods)
  componentData['methods'] = methods
  // 触发生命周期created
  component.methods.created && component.methods.created.apply(componentData)
  let node
  if(component.node) {
    node = component.node
  } else {
    // 词法分析
    const template = lexicalPaser(component.template)
    //console.log(template);
    // 语法分析
    node = syntaxInit(template, tagType.component)
    // 自定义命令解析
    traverseVueFlag(node)
    component.node = node
  }
  // 该节点是父节点的一个节点
  let createFn = () => {
    return createNode(node, proxyData)
  }
  let watch
  watch = new Watcher(() => {
    saveTempTargetWatcher(watch)
    // 更新至当前组件的组件表
    componentsStack.push(component.components)
    let componentVNode = createBlock(node, createFn)
    componentVNode.data.proxyData = proxyData
    // 没有赋值children,组件内置节点无意义，去除
    componentVNode.attr = vnode.attr
    Object.assign(componentVNode.data, vnode.data)
    componentVNode.key = vnode.key
    componentVNode.vueFlag = vnode.vueFlag
    componentVNode.val = vnode.val
    componentVNode = render(componentVNode, vnode.elm)

    // 将父组件和子组件联系起来
    Object.assign(vnode, componentVNode)

    componentsStack.pop()
    deleteTempTargetWatcher()
  })
  exitWatcherBox()
  return vnode.elm
}

export {
  createComponent
}