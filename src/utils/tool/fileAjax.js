function fileAjax(data) {
  let xhr = new XMLHttpRequest()

  const promise = new Promise((resolve, reject) => {
    data.url = 'http://localhost:8081/' + data.url
    xhr.open(data.method, data.url, true)
    fileAjax.interceptors.request(xhr)
    xhr.send(data.data)
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4) {
        if(fileAjax.interceptors.response(xhr)) {
          // const a = document.createElement("a")
          // a.download = "lalala"
          // a.href = URL.createObjectURL(xhr.response)
          // let musicUrl = URL.createObjectURL(xhr.response)
          // data.audio.src = musicUrl
          // //console.log(musicUrl);
          // a.click()
          resolve(xhr)
        } else {
          reject(JSON.parse(xhr.responseText))
        }
      }
    }
  })
  return promise
}

fileAjax.interceptors = {
  request(http){
    // 开启验证
    // http.withCredentials = true
    http.setRequestHeader("Content-Type","application/json;charset=UTF-8")
    http.setRequestHeader('Access-Control-Allow-Origin','http://localhost:8081')
    http.responseType = "blob"
  },
  response(http){
    if(http.status === 200 || http.status === 204) {
      return true
    }
    if(!http.message) {
      switch(http.status) {
        case 400:
          http.message = '错误请求'
          break;
        case 401:
          http.message = '未授权，请重新登录'
          break;
        case 403:
          error.message = '拒绝访问'
          break;
        case 404:
          http.message = '请求错误,未找到该资源'
          break;
        case 405:
          http.message = '请求方法未允许'
          break;
        case 408:
          http.message = '请求超时'
          break;
        case 500:
          http.message = '服务器端出错'
          break;
        case 501:
          http.message = '网络未实现'
          break;
        case 502:
          http.message = '网络错误'
          break;
        case 503:
          http.message = '服务不可用'
          break;
        case 504:
          http.message = '网络超时'
          break;
        case 505:
          http.message = 'http版本不支持该请求'
          break;
        default:
          http.message = `连接错误${http.status}`
      }
    }
  },
}

export default fileAjax