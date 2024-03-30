import { post } from "../../../api/http.js"
import { songUrl } from "../../../api/url/songUrl.js"
import uploadFile from "../../../utils/tool/uploadFile.js"
import { publicProxyData } from "./data.js"
import { MuyiTimer, MuyiButton, MuyiInput } from '../../UI/index.js'

const TableView = {
  template: 
  `
  <div class="music-table">
    <p class="music-table-title">我的音乐总库</p>
    <div class="music-table-main">
      <div class="music-table-buttons">
        <div class="music-table-play-all music-table-button">
          <i class="iconfont icon-24gl-play music-table-button-icon"></i>
          <p class="music-table-button-value">播放全部</p>
        </div>
        <div 
          class="music-table-download music-table-button"
          @click="openDialog"
        >
          <i class="iconfont icon-xiazai music-table-button-icon"></i>
          <p class="music-table-button-value">下载</p>
        </div>
        <div class="music-table-batch music-table-button">
          <i class="iconfont icon-ic_batch_default24px music-table-button-icon"></i>
          <p class="music-table-button-value">批量</p>
        </div>
      </div>
      <div class="music-table-icons">
        <div
          class="music-table-search-bar music-table-icon"
          v-if="data.searchOpen"
        >
          <input 
            class="music-table-search-bar-input"
            placeholder="搜索歌曲"
            @input="searchSong"
          ></input>
          <i 
            class="iconfont icon-cha music-table-search-bar-close"
            @click="closeSearchBar"
          >
          </i>
        </div>
        <div 
          class="music-table-search music-table-icon"
          @click="openSearchBar" 
          v-else-if="!data.searchOpen"
        >
          <i class="iconfont icon-sousuo music-table-icon-icon"></i>
          <p class="music-table-icon-value">搜索</p>
        </div>
        <div class="music-table-search music-table-icon">
          <i class="iconfont icon-ic_batch_default24px music-table-icon-icon"></i>
          <p class="music-table-icon-value">排序</p>
        </div>
        <div 
          class="music-table-search music-table-icon"
          @click="openUploadMusicDialog"
        >
          <i class="iconfont icon-ic_batch_default24px music-table-icon-icon"></i>
          <p class="music-table-icon-value">上传</p>
        </div>
      </div>
    </div>
    <div 
      class="muyi-dialog"
      v-if="data.uploadMusicDialog"
      @click="closeUploadMusicDialog"
    >
      <div 
        class="muyi-dialog-main music-upload-dialog"
        @click="preventEvent"
      >
        <i 
          class="iconfont icon-cha music-table-music-dilog-icon"
          @click="closeUploadMusicDialog"
        ></i>
        <div class="upload-music-dialog-form">
          <div class="upload-music-dialog-form-item">
            <p class="upload-music-dialog-form-title info-p">歌曲名称</p>
            <muyi-input 
              placeholder="请输入歌曲名称"
              @input="inputSongName"
              :value="data.songInfo.songName"
            ></muyi-input>
          </div>
          <div class="upload-music-dialog-form-item">
            <p class="upload-music-dialog-form-title info-p">歌手名称</p>
            <muyi-input 
              placeholder="请输入歌手"
              @input="inputAuthor"
              :value="data.songInfo.author"
            ></muyi-input>
          </div>
          <div class="upload-music-dialog-form-item">
            <p class="upload-music-dialog-form-title info-p">歌曲文件</p>
            <input class="music-file" type="file"></input>
          </div>
          <div class="upload-music-dialog-form-item">
            <p class="upload-music-dialog-form-title info-p">文件类型</p>
            <label>
              <input 
                type="radio" 
                name="fileType" 
                value=".mp3" 
                checked
                @click="getFileTypeValue"
              ></input>
              .mp3
            </label>
          </div>
        </div>
        <div class="upload-music-dialog-form-item form-button">
          <div class="upload-music-dialog-form-item-button">
            <muyi-button
              @click="uploadMusic"
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
  </div>
  `,
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
      searchOpen: false,
      searchValue: "dsad",
      dialogControll: false,
      // 文件上传弹窗开关
      uploadMusicDialog: false,
      fileInput: null,
      // 刚刚上传的MP3id
      fileId: -1,
      songInfo: {
        songName: '',
        author: '',
      },
      fileType: '.mp3'
    }
  },
  methods: {
    openSearchBar() {
      this.searchOpen = true
    },
    closeSearchBar() {
      this.searchOpen = false
      // 恢复歌单
      if(this.searchValue !== "") {
        this.searchValue = ""
        post(songUrl['querySongInfo'], this.publicProxyData.currentSongDangId)
        .then((data) => {
          this.publicProxyData.songCatalog.length = 0
          for(let i = 0; i < data.data.length; i++) {
            this.publicProxyData.songCatalog.push(data.data[i])
          }
        })
      }
    },
    openDialog() {
      this.dialogControll = true
    },
    uploadMusic() {
      if(!this.fileInput) {
        this.fileInput = document.getElementsByClassName("music-file")[0]
        if(!this.fileInput) {
          //console.warn("获取fleInput失败");
          return
        }
      }
      let musicFile = new FormData()
      musicFile.append("file", this.fileInput.files[0])
      uploadFile({
        method: "POST",
        url: songUrl['uploadMusic'],
        data: musicFile
      })
      .then((data) => {
        this.fileId = data.data
        post(songUrl["insertSongInfo"], {
          id: 1,
          songName: this.songInfo.songName,
          fileSize: this.fileInput.files[0].size / 1024 / 1024,
          author: this.songInfo.author,
          createTime: new Date(),
          fileType: this.fileType,
          song: {
            id: this.fileId,
            songMain: null,
          },
          cid: this.publicProxyData.currentSongDangId,
          sid: this.fileId
        }).then((data) => {
          this.publicProxyData.songCatalog.length = 0
          post(songUrl['querySongInfo'], this.publicProxyData.currentSongDangId)
          .then((data) => {
            for(let i = 0; i < data.data.length; i++) {
              // debugger
              this.publicProxyData.songCatalog.push(data.data[i])
            }
            this.publicProxyData.currentSongInfo = 
              data.data.length ? data.data[0] : null
          })
          .catch((error) => {
          })
        })
      })
    },
    searchSong(event) {
      this.searchValue = event.target.value
      post(songUrl["searchSong"], {
        songName: this.searchValue ?? "",
        cid: this.publicProxyData.currentSongDangId,
      })
      .then((data) => {
        this.publicProxyData.songCatalog.length = 0
        for(let i = 0; i < data.data.length; i++) {
          this.publicProxyData.songCatalog.push(data.data[i])
        }
      })
    },
    openUploadMusicDialog() {
      this.uploadMusicDialog = true
    },
    closeUploadMusicDialog() {
      this.uploadMusicDialog = false
    },
    preventEvent(event) {
      event.stopPropagation()
    },
    inputSongName(value) {
      this.songInfo.songName = value
    },
    inputAuthor(value) {
      this.songInfo.author = value
    },
    getFileTypeValue(event) {
      this.fileType = event.target.value
    },
    reset(event) {
      this.songInfo.songName = ""
      this.songInfo.author = ""
      if(!this.fileInput) {
        this.fileInput = document.getElementsByClassName("music-file")[0]
        if(!this.fileInput) {
          //console.warn("获取fleInput失败");
          return
        }
      }
      this.fileInput.value = ""
    } 
  },
}

export default TableView