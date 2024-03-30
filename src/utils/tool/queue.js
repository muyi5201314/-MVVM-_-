import { isNumber, isUndefined } from "./typeJudge.js"

// 队列
class Queue {
  constructor(capacity) {
    if(!isUndefined(capacity) && (!isNumber(capacity) || capacity <= 0)) {
      return new Error('队列的空间大小应为正数')
    }
    if(capacity) {
      this.capacity = capacity
    }
    this.start = null
    this.nowCapacity = 0
    this.end = null
  }
  pop(){
    if(this.nowCapacity) {
      this.start = this.start.next
      this.nowCapacity --
    }
  }
  push(item) {
    if(this.capacity && this.nowCapacity === this.capacity) {
      //console.warn('队列的空间已满');
      return
    }
    if(this.nowCapacity) {
      this.end.next = {
        value: item,
        next: null
      }
      this.end = this.end.next
    } else {
      this.end = this.start = {
        value: item,
        next: null
      }
    }
    this.nowCapacity++
  }
  empty() {
    return this.nowCapacity === 0
  }
  get() {
    if(this.empty()) {
      // //console.warn('栈为空');
      return null
    }
    return this.start.value
  }
  clear() {
    while(!this.empty()) {
      this.start = this.start.next
      this.nowCapacity --
    }
  }
}

export {Queue}