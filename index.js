import path from 'path'
import fs from "fs"
import http from 'http'
import url from 'url'
import chokidar from 'chokidar'
import WebSocket from 'nodejs-websocket'
import ws from 'ws'
// console.log(ws, ws.Server);

import { initRouter } from './src/router/index.js'
import AppView from './AppView.js'
import { createApp } from './src/parser/createNode/index.js'
import { doMounted } from './src/parser/liveCycle.js'
import routerSetting from './src/router/routerSetting.js'

// import jsdom from 'jsdom'
// const { JSDOM } = jsdom;

// let rootVNode

// 文件转发器
function fileHandle(req, res) {
  let url = req.url.split("?")[0]
  let seq = req.url.split("?")[1]?.split("&") ?? []
  console.log(url);
  const FilePath = path.join("D:\\vuejs\\graduate_work\\-MVVM-_-\\", url);
  // 文件不存在
  if (!fs.existsSync(FilePath)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write("Not Found")
    return res.end();
  }
  if (url.endsWith(".css")) {
    const fileStream = fs.readFileSync(FilePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(fileStream);
    return
  }
  if (url.endsWith(".jpg")) {
    const fileStream = fs.readFileSync(FilePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.write(fileStream);
    res.end();
    return
  }
  if (url.endsWith(".png")) {
    const fileStream = fs.readFileSync(FilePath);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.write(fileStream);
    return res.end();
  }
  if (url.endsWith(".js")) {
    const fileStream = fs.readFileSync(FilePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.write(fileStream);
    return res.end();
  }
  const fileStream = fs.readFileSync(FilePath);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log();
  res.write(fileStream);
  return res.end();
}

// 初始化服务
function init() {
  const settingJSON = fs.readFileSync("./setting.json", "utf-8")
  return JSON.parse(settingJSON)
}
const settingData = init()


// 创建websocket服务
const wss = WebSocket.createServer(function (conn) {
  // 创建 HTTP 服务器
  const server = http.createServer((req, res) => {
    // 如果请求的是根路径，则返回 HTML 页面
    if (req.url === '/') {
      fs.readFile(settingData.indexHtmlDir, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
    // return fileHandle(req, res)
  });
  // 监听端口
  server.listen(9983, () => {
    console.log('Server running at http://localhost:9983/');
  });

  // 当收到客户端消息时触发
  conn.on("text", function (str) {
    console.log("Received " + str);

    // 向客户端发送消息
    conn.sendText("Hello, client!");
  });

  // 当连接关闭时触发
  conn.on("close", function (code, reason) {
    console.log("Connection closed");
  });
}).listen(9984);
// wss.on('connection', function connection(ws) {
//   console.log('Client connected');

//   const watcher = chokidar.watch(settingData.listtenDir, {
//     ignored: /[\/\\]\./,
//     persistent: true
//   });

//   // 当有文件添加、修改或删除时，向客户端发送通知
//   watcher.on('all', (event, path) => {
//     console.log(`File ${path} ${event}`);
//     const indexHtmlContent = fs.readFileSync(settingData.indexHtmlDir, "utf-8")
//     ws.send(indexHtmlContent)
//     // ws.end()
//     // returnd
//   });
//   // (req, res) => {
//   //   let url = req.url.split("?")[0]
//   //   let seq = req.url.split("?")[1]?.split("&") ?? []
//   //   // console.log(url);
//   //   for (let i = 0; i < routerSetting.length; i++) {
//   //     if (url === routerSetting[i].path) {
//   //       let indexHtmlContent = fs.readFileSync("./public/index.html", "utf-8")
//   //       res.write(indexHtmlContent);
//   //       res.end();
//   //       return
//   //     }
//   //   }
//   //   return fileHandle(req, res)
//   // }

//   // 当客户端断开连接时，停止监听文件夹变化
//   ws.on('close', function () {
//     console.log('Client disconnected');
//     watcher.close();
//   });
// });

// console.log("http://localhost:9983 已开启");
// // server.listen(9983, () => {
// //   console.log("http://localhost:9983 已开启");
// // })

// init()