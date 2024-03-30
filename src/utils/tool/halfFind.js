function halfFind(array, target) {
  let left = 0, right = array.length - 1, half
  while(left <= right) {
    half = (left + right) >> 1;
    if(array[half] === target) {
      return half
    } else if(array[half] > target) {
      right = half - 1
    } else {
      left = half + 1
    }
  }
  return right === -1 ? -1 : left
}

export {
  halfFind
}