import { post } from "../../../api/http.js";
import { songUrl } from "../../../api/url/songUrl.js";
import { publicProxyData } from "./data.js";
import { MuyiInput, MuyiButton } from '../../UI/index.js'

const SiderBar = {
  template: 
  `
  <div
    :class="
      data.publicProxyData.siderBarOpen ?
      'sider-bar sider-bar-open' : 
      'sider-bar sider-bar-folder'"
    @click="stopPropagation"
  >
    <div class="sider-bar-main">
      <div class="sider-bar-main-title">
        <i class="iconfont icon-gedan sider-bar-main-title-icon"></i>
        <div class="sider-bar-main-title-value">
          <p class="info-p">歌单列表</p>
          <i class="info-p"></i>
        </div>
      </div>
      <div class="sider-bar-main-itemize">
        <div class="sider-bar-main-itemize-header">
          <i class="sider-bar-main-itemize-title">我的歌单</i>
          <i 
            class="iconfont icon-tianjia sider-bar-main-itemize-icon"
            @click="openUploadMusicDialog"
          ></i>
        </div>
        <div class="sider-bar-main-itemize-main">
          <div
            class="sider-bar-main-itemize-main-value"
            v-for="(item, index) in data.publicProxyData.songDang"
            v-key="item.id"
          >
            <p class="info-p" @click="changeSongSheet(item.id)">{{item.name}}</p>
            <i class="" v-if="index !== 0" @click="deleteSongSheet(item.id)">删</i>
          </div>
        </div>
      </div>
    </div>
    <div class="sider-bar-bar" @click="tranlate">
      <i 
        :class=" data.publicProxyData.siderBarOpen ?
          'iconfont icon-zuobian sider-bar-bar-icon' :
          'iconfont icon-youbian sider-bar-bar-icon' "
      ></i>
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
        <div class="upload-music-dialog-form-item">
          <p class="upload-music-dialog-form-title info-p">歌曲名称</p>
          <muyi-input 
            placeholder="请输入歌单名称"
            @input="inputSongSheetName"
            :value="data.songSheetName"
          ></muyi-input>
        </div>
      </div>
      <div class="upload-music-dialog-form-item form-button">
        <div class="upload-music-dialog-form-item-button">
          <muyi-button
            @click="insertSongSheet"
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
      siderBar: null,
      isOpen: false,
      publicProxyData: publicProxyData,
      uploadMusicDialog: false,
      songSheetName: '',
    }
  },
  methods: {
    leftTranlate() {
      //console.log('dasd');
    },

    // 侧栏折叠或展开
    tranlate(event) {
      this.publicProxyData.siderBarOpen = !this.publicProxyData.siderBarOpen
      // 停止冒泡
      event.stopPropagation()
    },
    // 停止冒泡
    stopPropagation(event) {
      event.stopPropagation()
    },
    openUploadMusicDialog() {
      this.uploadMusicDialog = true
    },
    closeUploadMusicDialog() {
      this.uploadMusicDialog = false
    },
    inputSongSheetName(value) {
      this.songSheetName = value
    },
    insertSongSheet() {
      let data = {
        uid: publicProxyData.user.id,
        name: this.songSheetName,
      }
      post(songUrl["insertSongSheet"], data)
      .then((res) => {
        this.methods.querySongSheet()
        this.methods.closeUploadMusicDialog()
      })
    },
    changeSongSheet(id) {
      this.publicProxyData.currentSongDangId = id
      post(songUrl['querySongInfo'], this.publicProxyData.currentSongDangId)
      .then((data) => {
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
    deleteSongSheet(id, event) {
      post(songUrl["deleteSongSheet"], id)
      .then((res) => {
        this.methods.querySongSheet()
      })
      this.methods.preventEvent(event)
    },
    reset() {
      this.songSheetName = ""
    },
    preventEvent(event) {
      event.stopPropagation()
    },
    querySongSheet(){
      this.publicProxyData.songDang.length = 0
      post(songUrl["querySongSheet"], this.publicProxyData.user.id)
      .then((data) => {
        for(let i = 0; i < data.data.length; i++) {
          this.publicProxyData.songDang.push(data.data[i])
        }
        this.publicProxyData.currentSongDangId = this.publicProxyData.songDang[0].id
      })
      .catch((error) => {
      })
    },
    mounted() {
      this.publicProxyData.siderBarOpen = false
      let i = 5
      this.publicProxyData.songDang.length = 0
      this.methods.querySongSheet()
      // setTimeout(() => {
      //   // this.publicProxyData.songDang.push({
      //   //   id: i++,
      //   //   value: '浮生双梦'
      //   // })
      //   // this.publicProxyData.songDang.shift()
      // }, 1000)
      // setTimeout(() => {
      //   this.publicProxyData.songDang[1].value="dasd"
      // }, 1000)
    },
  },
}

export default SiderBar