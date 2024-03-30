import { playMusic } from "../../../api/http.js";
import { songUrl } from "../../../api/url/songUrl.js";
import { createWatherBox, exitWatcherBox, watchEffect, Watcher } from "../../../parser/reactive/proxy.js";
import { publicProxyData } from "./data.js";
import { MuyiTimer, MuyiButton, MuyiInput } from '../../UI/index.js'

const MusicPlayer = {
  template:
    `
  <div class="music-player">
    <div 
      class="music-player-progress-bar"
      @click="changeProgressBar"
      @dragstart="muyi"
      @drag="changeProgressBar"
      @dragend="muyi"
    >
      <div 
        class="music-player-progress-bar-played"
        style="width: 0%;"
      ></div>
      <div class="music-player-progress-bar-not-play"></div>
    </div>
    <div class="music-player-main">
      <div class="music-player-main-info">
        <img 
          class="music-player-main-info-img"
          style="animation-play-state: paused;"
          src="./public/BackGroundImg.jpg"
        ></img>
        <div class="music-player-main-info-main">
          <div class="music-player-main-info-info">
            <p class="music-player-main-info-name">
              {{data.publicProxyData.currentSongInfo?.songName ?? '加载失败'}}
            </p>
            <p class="music-player-main-info-singer">
              {{'-' + (data.publicProxyData.currentSongInfo?.author ?? '')}}
            </p>
          </div>
          <div class="music-player-main-info-controll">
            <span 
              class="tooltip" 
              data-tool-tip="下载"
            >
              <i class="iconfont icon-xiazai music-player-main-info-controll-icon">
              </i>
            </span>
          </div>
        </div>
      </div>
      <div class="music-player-main-controll">
        <span 
          class="tooltip music-player-controll-order" 
          data-tool-tip="顺序"
          v-if="data.musicPlayOrder === 0"
          @click="changMusicPlayOrder"
        >
          <i class="iconfont icon-liebiaoshunxu"></i>
        </span>
        <span
          class="tooltip music-player-controll-order" 
          data-tool-tip="随机"
          v-else-if="data.musicPlayOrder === 1"
          @click="changMusicPlayOrder"
        >
          <i class="iconfont icon-suiji"></i>
        </span>
        <span 
          class="tooltip music-player-controll-order" 
          data-tool-tip="循环"
          v-else
          @click="changMusicPlayOrder"
        >
          <i class="iconfont icon-xunhuan"></i>
        </span>
        <span 
          class="tooltip music-player-controll-pre"
          data-tool-tip="上一曲"
          @click="preSong"
        >
          <i class="iconfont icon-shangyiqu music-player-controll-pre-icon"></i>
        </span>
        <div 
          class="tooltip music-player-controll-pause"
          :data-tool-tip="data.publicProxyData.isMusicPlaying ? '暂停' : '播放'"
          @click="controlMusicPlayOrPause"
        >
          <i :class=" data.publicProxyData.isMusicPlaying ?
            'iconfont icon-24gf-pause2 music-player-controll-pause-icon' :
            'iconfont icon-bofang music-player-controll-pause-icon' "></i>
        </div>
        <span 
          class="tooltip music-player-controll-next"
          data-tool-tip="下一曲"
          @click="nextSong"
        >
          <i class="iconfont icon-xiayiqu music-player-controll-next-icon"></i>
        </span>
        <span 
          class="tooltip music-player-controll-order"
          data-tool-tip="音量"
        >
          <i class="iconfont icon-suiji"></i>
        </span>
      </div>
      <div>
        <audio 
          class="music-player-audio"
          aotoplay
          :volume="data.volume"
          meta
          @ended="songEnd"
        >
          对不起，您的浏览器不支持播放音频，请升级浏览器！
        </audio>
      </div>
      <div class="">
      </div>
    </div>
  </div>
  `,
  // <muyi-timer
  //         :showHour="false"
  //         :startCount="data.startCount"
  //         :endCount="data.endCount"
  //         @end="songEnd"
  //         @play="songPlay"
  //       ></muyi-timer>
  // 这里有可能形成闭环
  components: {
    'muyi-timer': MuyiTimer
  },
  props: {
  },
  emits: new Set(),
  data() {
    return {
      offSetLeft: document.body.offsetWidth * 0.15,
      // 播放器DOM
      audio: null,
      // 已播放进度DOM
      played: null,
      // 歌曲封面
      songImg: null,
      // 完整进度条DOM
      progressBar: null,
      // 音乐是否播放中
      isMusicPlaying: false,
      startCount: 0,
      endCount: 100,
      // 播放顺序, 0为顺序播放，1为随机播放，2为循环播放
      musicPlayOrder: 0,
      // 音量值
      volume: 1,
      publicProxyData: publicProxyData
    }
  },
  methods: {
    entryProgressBar(event) {

    },
    changeMusicProcess(process) {
      if (!this.audio) {
        this.audio = document.getElementsByClassName('music-player-audio')[0]
        if (!this.audio) {
          //console.warn("audio标签获取失败");
          return
        }
      }
      if (!this.played) {
        this.played = document.getElementsByClassName("music-player-progress-bar-played")[0]
        if (!this.played) {
          //console.warn('进度进度获取失败');
          return
        }
      }
      // 播放时长
      let duration = this.audio.duration
      // 当前播放时间点
      let currentTime = duration * process
      this.audio.currentTime = currentTime
      // 宏任务
      setTimeout(() => {
        this.played.style.cssText = `transition: width ${duration - currentTime}s linear;width: 100%;`
      }, 0)
    },
    changeProgressBar(event) {
      //console.log(event);
      if (!this.played) {
        this.played = document.getElementsByClassName("music-player-progress-bar-played")[0]
        if (!this.played) {
          //console.warn('进度进度获取失败');
          return
        }
      }
      if (!this.progressBar) {
        this.progressBar = document.getElementsByClassName("music-player-progress-bar")[0]
        if (!this.progressBar) {
          //console.warn('进度条获取失败');
          return
        }
      }
      let width = (event.clientX - this.offSetLeft) / this.progressBar.offsetWidth * 100
      this.played.style.cssText = `width: ${width}%`
      if (event.type === "click") {
        this.methods.changeMusicProcess(width / 100)
      }
    },
    muyi() {
      //console.log(1);
    },

    downMusic() {
      if (!this.audio) {
        this.audio = document.getElementsByClassName('music-player-audio')[0]
        if (!this.audio) {
          //console.warn("audio标签获取失败");
          return
        }
      }
      playMusic(songUrl['downSong'], this.publicProxyData.songCatalog[this.publicProxyData.currentIndex].song.id)
        .then((data) => {
          let musicUrl = URL.createObjectURL(data.response)
          this.audio.src = musicUrl
          // 更改当前音乐
          this.publicProxyData.currentSongId = this.publicProxyData.songCatalog[this.publicProxyData.currentIndex].song.id
        })
    },

    // 歌曲播放结束
    songEnd(event) {
      switch (this.musicPlayOrder) {
        // 顺序播放
        case 0:
          this.methods.nextSong()
          break
        // 随机播放
        case 1:
          this.methods.nextSong()
          break
        // 循环播放
        case 2:
          // 暂停音乐
          this.publicProxyData.isMusicPlaying = false
          if (!this.played) {
            this.played = document.getElementsByClassName("music-player-progress-bar-played")[0]
            if (!this.played) {
              //console.warn('进度进度获取失败');
              return
            }
          }
          this.played.style.cssText = "width:0%;"
          this.methods.changeMusicProcess(0)
          // 播放音乐
          this.publicProxyData.isMusicPlaying = true
          break
      }
    },

    // 控制音乐开关
    controlMusicPlayOrPause() {
      // 初始化
      if (this.publicProxyData.currentSongId === -1) {
        if (this.publicProxyData.songCatalog.length > 0) {
          this.methods.downMusic()
        }
      } else {
        this.publicProxyData.isMusicPlaying = !this.publicProxyData.isMusicPlaying
      }
    },

    // 音乐暂停或播放
    musicPlayOrPause() {
      // //console.log(2137021983);
      if (!this.audio) {
        this.audio = document.getElementsByClassName('music-player-audio')[0]
        if (!this.audio) {
          //console.warn("audio标签获取失败");
          return
        }
      }
      if (!this.played) {
        this.played = document.getElementsByClassName("music-player-progress-bar-played")[0]
        if (!this.played) {
          //console.warn('进度进度获取失败');
          return
        }
      }
      if (!this.songImg) {
        this.songImg = document.getElementsByClassName('music-player-main-info-img')[0]
        if (!this.songImg) {
          //console.warn('歌曲封面获取失败');
          return
        }
      }
      if (this.publicProxyData.isMusicPlaying) {
        this.audio.play().then(() => {
          // 当前播放时间点
          let currentTime = this.audio.currentTime
          // 播放时长
          let duration = this.audio.duration
          this.played.style.cssText = `width: 100%; transition: width ${duration - currentTime}s linear`;
          // this.songImg.classList.add('rotate-animation')
          this.songImg.style.cssText = "animation-play-state: running;"
        })
      } else {
        // 当前播放时间点
        let currentTime = this.audio.currentTime
        // 播放时长
        let duration = this.audio.duration
        this.played.style.cssText = `width: ${currentTime / duration * 100}%;`
        this.audio.pause()
        this.songImg.style.cssText = "animation-play-state: paused;"
        // this.songImg.classList.remove('rotate-animation')
      }
    },
    // 播放上一曲
    preSong() {
      if (this.publicProxyData.songCatalog.length === 0) {
        //console.warn("歌曲加载失败");
        return
      }
      switch (this.musicPlayOrder) {
        // 循序播放
        case 0:
        // 单曲循环
        case 2:
          this.publicProxyData.currentIndex = this.publicProxyData.currentIndex > 0 ?
            this.publicProxyData.currentIndex - 1 : this.publicProxyData.songCatalog.length - 1
          break
        // 随机播放
        case 1:
          this.publicProxyData.currentIndex = Math.floor(Math.random() * this.publicProxyData.songCatalog.length)
          break
        default:
          break
      }
      // 更换歌区信息
      this.publicProxyData.currentSongInfo = this.publicProxyData.songCatalog[this.publicProxyData.currentIndex]
      // 音乐暂停
      this.publicProxyData.isMusicPlaying = false
      this.methods.downMusic()
    },
    nextSong() {
      if (this.publicProxyData.songCatalog.length === 0) {
        //console.warn("歌曲加载失败");
        return
      }
      switch (this.musicPlayOrder) {
        // 循序播放
        case 0:
        // 单曲循环
        case 2:
          this.publicProxyData.currentIndex = this.publicProxyData.currentIndex < this.publicProxyData.songCatalog.length - 1 ?
            this.publicProxyData.currentIndex + 1 : 0
          break
        // 随机播放
        case 1:
          this.publicProxyData.currentIndex = Math.floor(Math.random() * this.publicProxyData.songCatalog.length)
          break
        default:
          break
      }
      // 更换歌区信息
      this.publicProxyData.currentSongInfo = this.publicProxyData.songCatalog[this.publicProxyData.currentIndex]
      // 音乐暂停
      this.publicProxyData.isMusicPlaying = false
      this.methods.downMusic()
    },
    // 随机、顺序、循环图标改变
    changMusicPlayOrder() {
      let musicPlayOrder = this.musicPlayOrder
      musicPlayOrder++
      this.musicPlayOrder = musicPlayOrder % 3
    },
    changeCurrentMusic(songInfo) {
      this.publicProxyData.isMusicPlaying = false
      // 暂停音乐
      if (!this.audio) {
        this.audio = document.getElementsByClassName('music-player-audio')[0]
        if (!this.audio) {
          //console.warn("audio标签获取失败");
          return
        }
      }
      if (!this.played) {
        this.played = document.getElementsByClassName("music-player-progress-bar-played")[0]
        if (!this.played) {
          //console.warn('进度进度获取失败');
          return
        }
      }
      this.played.style.cssText = "width: 0%";
      // 播放音乐
      this.publicProxyData.isMusicPlaying = true
    },
    created() {
    },
    mounted() {
      watchEffect(
        () => this.publicProxyData.isMusicPlaying,
        this.methods.musicPlayOrPause
      )
      watchEffect(
        () => this.publicProxyData.currentSongId,
        this.methods.changeCurrentMusic
      )
    },
  },
}

export default MusicPlayer