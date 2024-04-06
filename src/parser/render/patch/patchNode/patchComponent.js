function patchComponent(oldVNode, newVNode) {
  let proxyData = oldVNode.data.proxyData
  let props = proxyData.props
  let emits = proxyData.emits
  let newAttr = newVNode.attr
  // debugger
  for(let i=0, newAttr_length = newAttr.length; i < newAttr_length; i++) {
    if(props.hasOwnProperty(newAttr[i].key)) {
      if(props[newAttr[i].key] !== newAttr[i].val) {
        props[newAttr[i].key] = newAttr[i].val
      }
    } else if(emits.hasOwnProperty(newAttr[i].key)) {
      if(emits[newAttr[i].key] !== newAttr[i].val) {
        emits[newAttr[i].key] = newAttr[i].val
      }
    }
  }
  // for(let )
  // let mi
  // //console.log(parent);
}

export {
  patchComponent
}

{
  name: "属性名称";
  value: "属性值";
  el: "dom元素";
  type: "指令种类";
  data: {}//扩展区;
}