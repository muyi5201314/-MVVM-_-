// import { halfFind } from "./halfFind.js"

function findLenSonArray(array) {
  let indexArray = []
  let sonArray = []
  let index
  for(let i = 0, array_length = array.length; i < array_length; i++) {
    index = halfFind(sonArray, array[i])
    if(index >= sonArray.length) {
      sonArray.push(array[i])
      indexArray.push(i)
    } else if(index > -1 && array[i] > sonArray[index]) {
      sonArray[index] = array[i]
      indexArray[index] = i
    }
  }
  return {
    length: sonArray.length,
    sonArray: sonArray,
    indexArray: indexArray,
  }
}

export {
  findLenSonArray
}