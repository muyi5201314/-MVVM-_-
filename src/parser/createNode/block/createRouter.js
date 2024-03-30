import { beforeLeave } from "../../../router/dynamic.js"
import { getRouterInstanll } from "../../../router/router.js"
import { tagType } from "../../data.js"
import { lexicalPaser, syntaxInit, traverseVueFlag } from "../../paser/index.js"
import { createProxy, createWatherBox, exitWatcherBox, Watcher } from "../../reactive/proxy.js"
import { render } from "../../render/index.js"
import { createBlock } from "../createBlock.js"
import { createNode } from "../createNode.js"
import { componentsStack, currentComponents } from "../data.js"

// 创建页面
function createRouter(vnode) {
  createWatherBox()
  const router = getRouterInstanll()
  let component = router.getRouterComponent()
  let componentData = component.data()
  // 触发生命周期beforeCreate
  component.methods.beforeCreate && component.methods.beforeCreate.apply(componentData)
  const proxyData = createProxy(componentData)
  const methods = {}
  // 代理方法，更改this指针
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
  // 收集路由离开生命周期
  beforeLeave.push(methods.beforeRouteLeave)
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
    //console.log(node);
  }

  // 提出newVNode节点
  let newVNode
  let createFn = () => {
    return createNode(node, proxyData)
  }
  new Watcher(() => {
    // 更新至当前组件的组件表
    componentsStack.push(component.components)
    newVNode = createBlock(node, createFn)
    newVNode.data.proxyData = proxyData
    newVNode = render(newVNode, vnode.elm)

    Object.assign(vnode, newVNode)
    componentsStack.pop()
  })
  exitWatcherBox()
  return newVNode.elm
}

export {
  createRouter
}