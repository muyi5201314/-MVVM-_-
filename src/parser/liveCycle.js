import { Stack } from "../utils/tool/stack.js";
import { isFunction } from "../utils/tool/typeJudge.js";

const mountCycle = new Stack()

// 
function mounted(fn) {
  mountCycle.push(fn)
}

// 执行mounted函数
function doMounted() {
  let fn
  while(fn = mountCycle.get()) {
    mountCycle.pop()
    isFunction(fn) && fn()
  }
}

export {
  mounted,
  doMounted
}