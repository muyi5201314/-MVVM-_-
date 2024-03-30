import { tagType } from "../../data.js"
import { lexicalPaser, syntaxInit, traverseVueFlag } from "../../paser/index.js"
import { createProxy, Watcher } from "../../reactive/proxy.js"
import { render } from "../../render/index.js"
import { createBlock } from "../createBlock.js"
import { createNode } from "../createNode.js"
import { componentsStack } from "../data.js"

// 创建AppView组件，程序入口
function createApp(component, container) {
  let componentData = component.data()
  const proxyData = createProxy(componentData)
  const methods = {}
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
    //console.log(node);
  }

  // 提出newVNode节点
  let newVNode, oldVNode
  let createFn = () => {
    return createNode(node, proxyData)
  }
  new Watcher(() => {
    // 更新至当前组件的组件表
    componentsStack.push(component.components)
    newVNode = createBlock(node, createFn)

    newVNode.data.proxyData = proxyData
    newVNode = render(newVNode, oldVNode?.elm)
    newVNode.data.parentNode = container
    oldVNode = newVNode

    componentsStack.pop()
  })

  return newVNode
}

export {
  createApp
}