import ajax from '../utils/tool/ajax.js'
import fileAjax from '../utils/tool/fileAjax.js'
// import { } from '../../init.js'

function get(url) {
  return ajax({
    method: "GET",
    url,
  })
}

function post(url, data, config) {
  return ajax({
    method: "POST",
    url,
    data: data,
    config
  })
}

function downFile(url, data) {
  fileAjax({
    method: "POST",
    url,
    data: data
  }).then((data) => {
    let response = data.response
    const a = document.createElement("a")
    let ContentDisposition = data.getResponseHeader('Content-disposition')
    let fileName = "默认.mp3"
    if(/filename=(.*)$/.test(ContentDisposition)) {
      fileName = RegExp.$1
      fileName = decodeURI(escape(fileName))
    }
    a.download = fileName
    a.href = URL.createObjectURL(response)
    a.click()
  })
}

function playMusic(url, data) {
  return fileAjax({
    method: "POST",
    url,
    data: data
  })
}

export {
  get,
  post,
  downFile,
  playMusic
}