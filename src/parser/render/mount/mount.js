import { mounted } from "../../liveCycle.js"
import { createNodes } from "./createNodes/createNodes.js"

// 挂载结点
function mount (vnode) {
  //console.log(vnode);
  let methods = vnode.data.proxyData.methods
  // 生命周期，节点未挂载之前
  methods.beforeMount && methods.beforeMount()
  // 添加子节点
  let dom = vnode.elm = document.createDocumentFragment()
  for(let i=0, children_length = vnode.children.length; i < children_length ;i++) {  
    dom.appendChild(createNodes(vnode.children[i], dom))
  }
  // 生命周期，节点挂载之后
  if(methods.mounted) {
    mounted(methods.mounted)
  }
}

export {
  mount
}