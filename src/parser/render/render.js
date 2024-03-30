import { mount } from "./mount/mount.js"
import { patch } from "./patch/patch.js"
import { getParentElm } from "./tool/getParentElm.js"
import { unMount } from "./unMount/unMount.js"

function render(vnode, container) {
  // debugger
  if(container?._vnode) {
    let oldVNode = container._vnode
    // 新旧vnode存在，节点更新
    patch(oldVNode, vnode)
    return container._vnode
  } else if(vnode){
    // 旧节点不存在，挂载节点
    mount(vnode)
    // 保存此次vnode
    vnode.elm._vnode = vnode
    return vnode
  } else {
    // 新节点不存在，卸载节点
    let parentNode = getParentElm(container._vnode)
    unMount(container._vnode, parentNode)
    container._vnode = null
    return container._vnode
  }
}

export {
  render
}