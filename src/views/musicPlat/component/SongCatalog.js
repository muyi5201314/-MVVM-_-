import { downFile, playMusic, post } from "../../../api/http.js"
import { songUrl } from "../../../api/url/songUrl.js"
import { publicProxyData } from "./data.js"
import { MuyiTimer, MuyiButton, MuyiInput } from '../../UI/index.js'
// import { document } from '../../../../init.js'

// SongCatalog
const  SongCatalog = {
  template: 
  `
  <div class="song-catalog">
    <div class="song-catalog-header">
      <p class="song-catalog-header-sort song-catalog-header-value">序号</p>
      <p class="song-catalog-header-song song-catalog-header-value">歌曲</p>
      <p class="song-catalog-header-singer song-catalog-header-value">歌手</p>
      <p class="song-catalog-header-size song-catalog-header-value">大小</p>
    </div>
    <div class="song-catalog-main">
      <div 
        v-for="(item, index) in data.publicProxyData.songCatalog"
        v-key="item.id"
        class="song-catalog-main-eve"
      > 
        <div class="song-catalog-main-sort">{{index + 1}}</div>
        <div class="song-catalog-main-song">
          <p class="song-catalog-main-value song-catalog-main-sone-value">{{item.songName}}</p>
          <div class="song-catalog-main-controller">
            <span 
              class="tooltip song-catalog-main-controller-icon" 
              data-tool-tip="暂停"
              @click="playSong(item, index)"
              v-if="item.song.id === data.publicProxyData.currentSongId && data.publicProxyData.isMusicPlaying"
            >
              <i class="iconfont icon-weibiaoti519">
              </i>
            </span>
            <span 
              class="tooltip song-catalog-main-controller-icon" 
              data-tool-tip="播放"
              @click="playSong(item, index)"
              v-else
            >
              <i class="iconfont icon-24gl-play">
              </i>
            </span>
            <span 
              class="tooltip song-catalog-main-controller-icon" 
              data-tool-tip="添加到"
              @click="openUploadMusicDialog(index)"
            >
              <i class="iconfont icon-tianjia"></i>
            </span>
            <span 
              class="tooltip song-catalog-main-controller-icon" 
              data-tool-tip="下载"
              @click="downSong(item)"
            >
              <i class="iconfont icon-xiazai"></i>
            </span>
          </div>
        </div>
        <div class="song-catalog-main-singer">
          <p class="song-catalog-main-value">{{item.author}}</p>
        </div>
        <div class="song-catalog-main-size">
          <p class="song-catalog-main-value">{{item.fileSize.toFixed(1) + 'MB'}}</p>
        </div>
      </div>
    </div>
  </div>
  <div 
    class="muyi-dialog"
    v-if="data.uploadMusicDialog"
    @click="closeUploadMusicDialog"
  >
    <div 
      class="muyi-dialog-main song-sheet-add-dialog"
      @click="preventEvent"
    >
      <i 
        class="iconfont icon-cha music-table-music-dilog-icon"
        @click="closeUploadMusicDialog"
      ></i>
      <div class="upload-music-dialog-form">
        <label 
          v-for="(item, index) in data.publicProxyData.songDang"
          v-key="item.id"
        >
          <input 
            type="radio" 
            name="selectSongSheet" 
            :value="item.id"
            :checked="item.id === publicProxyData.currentSongDangId"
          ></input>
          {{item.name}}
        </label>
      </div>
      <div class="upload-music-dialog-form-item form-button">
        <div class="upload-music-dialog-form-item-button">
          <muyi-button
            @click="addSongToSongSheet"
            value="上传"
          ></muyi-button>
        </div>
        <div class="upload-music-dialog-form-item-button">
          <muyi-button 
            @click="reset"
            value="重置"
          ></muyi-button>
        </div>
      </div>
    </div>
  </div>
  `,
  // 这里有可能形成闭环
  components: {
    'muyi-input': MuyiInput,
    'muyi-button': MuyiButton,
  },
  props: {
  },
  emits: new Set(),
  data() {
    return {
      publicProxyData: publicProxyData,
      audio: null,
      uploadMusicDialog: false,
      selectSongIndex: 0,
    }
  },
  methods: {
    // v-if="item.id === data.publicProxyData.currentSongId"
    playSong(item, index, event) {
      if(item.song.id === this.publicProxyData.currentSongId) {
        this.publicProxyData.isMusicPlaying = ! this.publicProxyData.isMusicPlaying
        return
      } 
      // 更换歌区信息
      this.publicProxyData.currentSongInfo = item
      // 音乐暂停
      this.publicProxyData.isMusicPlaying = false
      if(!this.audio) {
        this.audio = document.getElementsByClassName('music-player-audio')[0]
        if(!this.audio) {
          //console.warn("audio标签获取失败");
          return
        }
      }
      playMusic(songUrl['downSong'], item.song.id)
      .then((data) => {
        let musicUrl = URL.createObjectURL(data.response)
        this.audio.src = musicUrl
        // 更改当前音乐
        this.publicProxyData.currentSongId = item.song.id
        this.publicProxyData.currentIndex = index
      })
    },
    downSong(item, event) {
      downFile(
        songUrl['downSong'], 
        item.song.id,
      )
    },
    openUploadMusicDialog(index) {
      this.selectSongIndex = index
      this.uploadMusicDialog = true
    },
    closeUploadMusicDialog() {
      this.uploadMusicDialog = false
    },
    reset() {
      // this.songSheetName = ""
    },
    addSongToSongSheet() {
      let selectSongSheetId
      let selectSongSheetList = document.getElementsByName("selectSongSheet")
      for(let i=0, selectSongSheetList_length = selectSongSheetList.length; i < selectSongSheetList_length; i++) {
        if(selectSongSheetList[i].checked) {
          selectSongSheetId = Number(selectSongSheetList[i].value)
        }
      }
      let songInfo = this.publicProxyData.songCatalog[this.selectSongIndex]
      let data = {
        id: songInfo.id,
        songName: songInfo.songName,
        fileSize: songInfo.fileSize,
        author: songInfo.author,
        createTime: songInfo.createTime,
        fileType: songInfo.fileType,
        song: songInfo.song,
        cid: selectSongSheetId,
        sid: songInfo.sid,
      }
      post(songUrl["addSongToSongSheet"], data)
      .then((res) => {
      })
    },
    preventEvent(event) {
      event.stopPropagation()
    },
    mounted() {
      post(songUrl['querySongInfo'], this.publicProxyData.currentSongDangId)
      .then((data) => {
        //console.log(data);
        this.publicProxyData.songCatalog.length = 0
        for(let i = 0; i < data.data.length; i++) {
          // debugger
          this.publicProxyData.songCatalog.push(data.data[i])
        }
        this.publicProxyData.currentSongInfo = 
          data.data.length ? data.data[0] : null
      })
      .catch((error) => {
      })
    },
  },
}

export default SongCatalog