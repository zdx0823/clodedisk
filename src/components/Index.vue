<template>
  <div class="wrap">
    <div class="header">
      <!-- 返回 -->
      <div class="back" @click="goBack">
        <span class="icon iconfont iconnext-copy"></span>
      </div>
      <div class="title">{{title}}</div>
      <!-- 下拉菜单 -->
      <el-dropdown class="downList" @command="onDownMenuChange">
        <span class="el-dropdown-link">
          {{userInfo.username}}<i class="icon el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="downItem" command="logout">
            <span :style="downItemIcon" class="icon iconfont iconexit01-copy"></span>
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="mainWrap">
      <div class="main">

        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <el-menu-item index="0" @click="onCollapse">
            <i class="el-icon-s-fold"></i>
            <span slot="title">展开收起</span>
          </el-menu-item>
          <el-menu-item index="1" @click="onSideAll">
            <i class="el-icon-menu"></i>
            <span slot="title">全部文件</span>
          </el-menu-item>
          <el-menu-item index="2" @click="onSideUpload">
            <i class="el-icon-upload2"></i>
            <el-badge slot="title" :value="inProgressNum" :max="99" class="menuItem2Badge">
              <span>上传列表</span>
            </el-badge>
          </el-menu-item>
        </el-menu>

        <div class="mainBody">
          <router-view  
            @upload="onUpload"
          ></router-view>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import qq from 'fine-uploader'
import {mapActions, mapState} from 'vuex'
import { deJson, notify } from './util'
import APIURL from './apiUrl'
import apiUrl from './apiUrl'

let uploader = new qq.FineUploaderBasic({
  autoUpload: true,
  maxConnections: 3,
  request: {
    endpoint: APIURL.UPLOAD,
    methods: 'POST',
    customHeaders: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  },
  chunking: {
    enabled: true,
    mandatory: true,
    partSize: 1024 * 1024 * 5
  },
  callbacks: {},
  title: '首页'
})


const vm = {
  name: 'Index',
  props: ['appClick'],
  data: () => ({
    downItemIcon: {
      position: 'relative',
      top: '3px',
      fontSize: '22px'
    },
    isCollapse: false,
    collapseLabel: '收起',
    curInUploadNum: 0,
    userInfo: {}
  }),
  methods: {
    ...mapActions('index', [
      'uploadFile',
      'setTotalProgress',
      'changeProgress',
      'setInProgressNum',
      'setAllUploadComplete'
    ]),
    autoLogin () {
      this.$cookies.set('seller_id', 1)
    },
    onCollapse () {
      this.isCollapse = !this.isCollapse
      this.collapseLabel = this.isCollapse ? '展开' : '收起'
    },
    onSideAll () {
      this.$router.push('/')
    },
    onSideUpload () {
      this.$router.push('/progress')
    },

    onUpload (files, fid) {
      uploader.addFiles(files, { fid })
    },

    // uploader插件
    qqUpload (id/* , name */) {
      let file = uploader.getFile(id)
      this.uploadFile({
        name: file.name,
        progress: 0,
        uuid: uploader.getUuid(id),
        file
      })
      this.setInProgressNum(uploader.getInProgress())
      return Promise.resolve()
    },

    // 分片上传前回调
    qqUploadChunk (/* id, name, chunkData */) {},

    // 当个文件上传进度监控
    qqProgress (id, name, bytes, totalBytes) {
      let p = Math.ceil((bytes / totalBytes) * 100)
      let uuid = uploader.getUuid(id)
      this.changeProgress([uuid, p])
    },

    // 上传完成
    qqComplete (/* id, name, res */) {
      this.setInProgressNum(uploader.getInProgress())
    },

    // 全部进度监控
    qqTotalProgress (totalUploadedBytes, totalBytes) {
      if (totalUploadedBytes != 0 && totalBytes != 0) {
        let p = Math.ceil((totalUploadedBytes / totalBytes) * 100)
        this.setTotalProgress(p)
      }
    },

    // 上传失败
    qqError (id, name, errno, res) {
      const { msg } = deJson(res.responseText)
      this.$message.warning(msg)
    },

    // 全部上传完成
    qqAllComplete () {
      this.setAllUploadComplete(Date.now())
    },

    // 初始化三方插件回调函数
    initUploaderCallback () {
      uploader._options.callbacks.onUploadChunk = this.qqUploadChunk
      uploader._options.callbacks.onUpload = this.qqUpload
      uploader._options.callbacks.onProgress = this.qqProgress
      uploader._options.callbacks.onComplete = this.qqComplete
      uploader._options.callbacks.onTotalProgress = this.qqTotalProgress
      uploader._options.callbacks.onError = this.qqError
      uploader._options.callbacks.onAllComplete = this.qqAllComplete
    },

    // 返回上一级
    goBack () {
      this.$router.back()
    },

    onLogout () {

      // 

      $.post(apiUrl.LOGOUT).then(res => {

        const {data} = deJson(res)
        
        const tgc = data.tgc

        const url = `${apiUrl.LOGOUT_SSO}?tgc=${tgc}`

        window.location.replace(url)

      })

    },

    // 下拉菜单点击事件
    onDownMenuChange (command) {

      switch (command) {
        case 'logout':
          this.onLogout()
          break;
      }

    },

    // 获取用户信息
    getUserInfo () {
      $.get(apiUrl.USER_INFO).then(res => {
        const {data} = deJson(res)
        this.userInfo = data
      })
    }
  },
  computed: {
    ...mapState('index', ['inProgressNum']),
    title () {
      return this.$route.meta.title
    }
  },
  watch: {},
  mounted () {
    this.notify = notify(this)
    this.autoLogin()
    this.initUploaderCallback()
    this.getUserInfo()
  }
}
export default vm




</script>

<style scoped>

.wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 1200px;
  width: 90%;
  height: 90%;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 3px #c7c7c7;
}

.header {
  box-sizing: border-box;
  position: relative;
  z-index: 3;
  height: 60px;
  line-height: 60px;
  padding: 0 10px;
  border-bottom: 1px solid #e8e8e8;
}

.header .back {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  transition: .2s background;
  cursor: pointer;
}
.header .back:hover {
  background-color: #dddddd;
}

.header .downList {
  position: absolute;
  right: 10px;
  top: 0;
  padding: 0 10px;
}
.header .downList .el-dropdown-link .icon {
  margin-left: 8px;
}

.header .title {
  font-size: 16px;
  color: #333;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.mainWrap {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  top: -60px;
  left: 0;
  padding: 60px 0 0 0;
}

.main {
  width: 100%;
  height: 100%;
  display: flex;
}


.mainBody {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.el-menu-vertical-demo {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.menuItem2Badge >>> sup {
  top: 10px;
}


</style>