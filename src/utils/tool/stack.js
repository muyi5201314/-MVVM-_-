import { isNumber, isUndefined } from "./typeJudge.js"

class Stack {
  constructor(capacity) {
    if(!isUndefined(capacity) && (!isNumber(capacity) || capacity <= 0)) {
      return new Error('栈的空间大小应为正数')
    }
    if(capacity) {
      this.capacity = capacity
    }
    this.store = []
    this.index = -1
  }
  pop(){
    if(this.index === -1) {
      return
    } else {
      this.index --
    }
  }
  push(item) {
    if(this.capacity && this.index === this.capacity - 1) {
      //console.warn('栈的空间已满');
    }
    this.store[++this.index] = item
  }
  empty() {
    return this.index === -1
  }
  get() {
    if(this.empty()) {
      // //console.warn('栈为空');
      return null
    }
    return this.store[this.index]
  }
  clear() {
    this.store.length = 0
    this.index = -1
  }
}

export {Stack}