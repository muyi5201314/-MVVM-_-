import { createProxy } from "../../../parser/reactive/proxy.js"

const publicData = {
  user: {
    id: 0,
    username: '',
  },
  siderBarOpen: false,
  songDang: [
  ],
  songCatalog: [
  ],
  // 音乐是否播放
  isMusicPlaying: false,
  // 当前播放音乐信息
  currentSongId: -1,
  // 当前歌单id
  currentSongDangId: 1,
  // 当前播放音乐信息
  currentSongInfo: {
    id: 1
  },
  // 当前音乐下标
  currentIndex: 0,
}

const publicProxyData = createProxy(publicData)

export {
  publicProxyData,
}