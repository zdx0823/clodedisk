<template>
  <div class="wrap">
    <div class="mainBodyHeader">
      <el-button class="btn" size="mini" @click="onNewFolder">新建文件夹</el-button>
      <el-button
        class="btn"
        size="mini"
        @click="onRenameBtn"
        :disabled="selectedList.length > 1"
      >重命名</el-button>
      <el-button
        class="btn"
        size="mini"
        @click="onDelBtn"
        :disabled="selectedList.length == 0"
      >删除</el-button>
      <el-button
        class="btn"
        size="mini"
        @click="onUploadBtn"
      >上传文件</el-button>
      <el-button
        class="btn"
        size="mini"
        :disabled="selectedList.length == 0"
        @click="onCopyBtn"
      >复制</el-button>
      <el-button
        class="btn"
        size="mini"
        :disabled="selectedList.length == 0"
        @click="onCutBtn"
      >剪切</el-button>
      <el-button
        class="btn"
        size="mini"
        :disabled="copyList.length == 0"
        @click="onPasetBtn"
      >粘贴</el-button>
      <div style="display: none;">
        <input
          @change="onUpload"
          ref="qqfile"
          type="file"
          id="qqfile"
          multiple
        >
      </div>
    </div>
    <el-breadcrumb class="mainBodyCrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="item of crumb"
        :key="item.id"
        :to="item.path"
        class="crumbItem"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="checkAllBar">
      <!-- <el-checkbox :checked="isSelectAll" @change="onSelectAll" @click.stop="">全选</el-checkbox> -->
      <el-checkbox :value="isSelectAll" @change="onSelectAll">全选</el-checkbox>
      <div class="tip">已选择 <span>{{selectedList.length}}</span> 项</div>
    </div>
    <div class="mainBodyListWrap"  @contextmenu.prevent="onContextmenu">
      <div class="mainBodyListScroll" ref="mainBodyListScroll">
        <div class="mainBodyList clear" ref="mainBodyList">
          <el-popover
            width="100"
            trigger="manual"
            placement="right-start"
            v-for="item of curFolderData"
            :key="item.id"
            v-model="item.isShowContextmenu"
          >
            <div
              slot="reference"
              ref="mainBodyListItem"
              class="item mainBodyListItem"
              :class="{ itemImg: isImg(item), itemActive: item.selected }"
              :title="item.name"
              @dblclick.stop="onOpenFolder(item)"
              @click.stop="onResourceClick(item, $event)"
              @contextmenu.prevent.stop="onRigClick(item)"
              @mousedown.stop=""
            >
              <div class="itemSelectIcon">
                <span class="itemSelectIconIcon iconfont iconweibiaoti521"></span>
              </div>
              <template v-if="isImg(item)">
                <div class="imgPreviewBtn" @click.stop="onPreviewImg(item)">
                  <span class="imgPreviewBtnIcon iconfont iconsousuo-"></span>
                </div>
                <el-image
                  :src="item.img_path_sm"
                  fid="cover"
                ></el-image>
              </template>
              <template v-else>
                <i class="icon el-icon-folder-opened" v-if="item.type == 'folder'"></i>
                <i class="icon el-icon-tickets" v-else></i>
                <span class="text">{{item.name}}</span>
              </template>
            </div>
            <div class="fileContextmenu">
              <div
                @click="onOpenFolder(item)"
                v-show="item.type === 'folder'"
                :class="selectedList.length > 2 ? 'disabled' : ''"
              >打开</div>
              <div
                :class="selectedList.length > 2 ? 'disabled' : ''"
                @click="onPreviewImg(item)"
                v-show="isImg(item)"
              >查看大图</div>
              <div @click="onCopy(item)">复制</div>
              <div @click="onCut(item)">剪切</div>
              <div @click="onRename(item)" :class="selectedList.length > 2 ? 'disabled' : ''">重命名</div>
              <div @click="onDel(item)">删除</div>
            </div>
          </el-popover>
          <el-dialog
            :title="imgPreview.alias"
            :visible.sync="imgPreview.visible"
            :width="imgPreview.width"
            center
            modal
            modal-append-to-body
            append-to-body
          >
            <el-image
              :src="imgPreview.path"
              fit="cover"
            ></el-image>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import { deJson, notify, dragSelect } from './util'
import '@/assets/css/selectBox.css'
import APIURL from './apiUrl'


const vm = {
  name: 'IndexIndex',
  data: () => ({
    collapseLabel: '收起',
    curFolderData: [],
    curFid: 0,
    crumb: [],
    imgExtList: ['jpg', 'jpeg', 'png'],
    imgPreview: {
      path: '',
      visible: false,
      title: '',
      width: '0',
      alias: ''
    },
    curPath: '',
    selectedList: [],
    selfRouteUrl: '/folder',
    copyList: [],
    isOnDragSelect: false,
    isCut: false
  }),
  methods: {

    /**
     * 新建文件夹
     * 参数：fid，folderName；fid当前所在文件夹id，folderName文件名
     * 
     * 成功刷新当前页面，是否返回提示信息
     */
    onNewFolder () {
      this.$prompt('请输入文件夹名', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9/-]{2,16}$/,
        inputErrorMessage: '文件夹名只能包含中英文下划线，短斜线，反斜线，字数在1-16字'
      }).then(res => {
        let folderName = res.value

        $.post(APIURL.NEW_FOLDER, {
          fid: this.curFid,
          folderName
        })
        .then(res => {
          let { status, msg } = deJson(res)
          if (status == -1) {
            this.notify.error(msg)
            return
          }
          this.onGetListAllByPath(this.curPath)
        })
      })
    },


    /**
     * 根据路径获取文件夹下的信息，
     * 比如 /文件夹1/文件夹2，表示要获取"全部文件"下的"文件夹1"下的"文件夹2"下的数据
     * 
     * 成功将更新当前页面，更新面包屑，失败返回错误信息
     */
    onGetListAllByPath (path = '/') {

      $.get(APIURL.LIST_BY_PATH, {
        page: 1,
        pageSize: 100,
        path
      }).then(res => {
        
        const { msg, data, status } = deJson(res)

        // 失败
        if (status == -1) {
          this.notify.error(msg)
          return false
        }

        // 更新数据
        this.curFolderData = data.data.map(item => {

          // 关闭右键菜单
          item.isShowContextmenu = false
          
          // 取出后缀
          let arr = item.name.split('.')
          let ext = arr.length > 1 ? arr.pop() : ''
          item.ext = ext

          // 取消当前选中状态
          item.selected = false
          return item
        })

        // 面包屑
        this.crumb = []

        // 最后一个面包屑不需要path路径，因为当前就处于该path下
        let crumbData = data.crumbData
        for (let i = 0, len = crumbData.length; i < len; i++) {
          let _path = crumbData[i].path
          let obj = {
            path: (i + 1 == len)
              ? false
              : `${this.selfRouteUrl}?path=${_path}`,
            name: crumbData[i].name
          }
          
          this.crumb.push(obj)
        }
        
        // 更新当前环境id，path值，清空选中项数组
        this.curFid = data.fid
        this.curPath = path
        this.selectedList = []
        
        // 初始化框选功能，延迟执行
        this.$nextTick(() => this.initDragSelect())
        return true
      })

    },

    /**
     * 打开文件夹
     * 通过更新路由来触发更新，间接调用了onGetListAllByPath方法
     */
    onOpenFolder (item) {
      if (this.selectedList.length > 2) return
      let path = item.path
      this.$router.push(`${this.selfRouteUrl}?path=${path}`)
    },

    /**
     * 资源被点击事件
     * 判断是否为多选，如果同时按下ctrl为多选，否则为单选
     */
    onResourceClick (item, event) {
      
      let isCtrl = event.ctrlKey

      // 多选
      if (isCtrl) {

        if (!item.selected) {
          item.selected = true
          this.selectedList.push(item)
        } else {

          // 已被选中，需要取消选择状态，并更新数据
          let index = -1
          let selectedData = this.selectedList

          // 找出对应下标
          for (let i = 0, len = selectedData.length; i < len; i++) {
            if (selectedData[i].id === item.id) {
              index = i
              break
            }
          }
          item.selected = false
          this.selectedList.splice(index, 1)
        }

      } else {

        this.selectedList.forEach(item => (item.selected = false))
        this.selectedList = []
        this.selectedList.push(item)
        item.selected = true

      }

      // 关掉所有右键菜单
      this.curFolderData.forEach(item => (item.isShowContextmenu = false))
    },

    /**
     * 资源右键点击事件，打开右键菜单
     */
    onRigClick (item) {
      item.isShowContextmenu = true
    },

    /**
     * 删除资源逻辑
     * 参数idList，数组，形如：[id: 1, type: 'folder']
     * 
     * 返回请求后的promise
     */
    delByIdList (idList) {

      return $.post(APIURL.DEL, {
        _method: 'delete',
        idList
      }).then(res => {

        let {msg, status} = JSON.parse(res)
        if (status == -1) this.notify.error(msg)
        return res

      })

    },

    /**
     * 删除文件事件
     * 支持同时删除一个或同时删除多个
     * 如果有item参数则表示只删除一个
     */
    onDel (item, idList) {

      let tIdList = []
      if (item == null) {
        tIdList = idList
      } else {
        let { id, type } = item
        item.isShowContextmenu = false

        if (this.selectedList.length > 1) {
          tIdList = [...this.selectedList].map(item => ({
            id: item.id,
            type: item.type
          }))
        } else {
          tIdList = [{id, type}]
        }

      }

      this.$confirm('此操作将永久删除该文件, 是否继续?', '确定删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delByIdList(tIdList).then(res => {
          let {status} = deJson(res)
          if (status == 1) {
            this.onGetListAllByPath(this.curPath)            
          }
        })
      })
    },

    /**
     * 重命名资源名，对于非文件夹，重命名的是它们的alias字段
     */
    onRename (item) {
      if (this.selectedList.length > 2) return
      item.isShowContextmenu = false
      let type = item.type
      let fid = this.curFid
      let defaultVal = type === 'folder' ? item.name.split('.') : item.alias.split('.')
      if (defaultVal.length > 1) {
        defaultVal.pop()
      }
      defaultVal = defaultVal.join('')
      this.$prompt('请输入新的文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[^\\\\/:\\*\\?"<>\\|]{1,}$/,
        inputErrorMessage: '文件名不能为空，不能出现 \\/:*?<>|',
        inputValue: defaultVal
      }).then(res => {
        let name = res.value.split('.').pop()
        let renameData = {
          _method: 'put',
          id: item.id,
          name,
          fid
        }

        let ajax = type === 'folder'
          ? $.post(APIURL.RENAME_FOLDER, renameData)
          : $.post(APIURL.RENAME_FILE, renameData)

        ajax
        .then(res => {
          let {status, msg} = deJson(res)
          if (status == -1) {
            this.notify.error(msg)
          } else {
            this.onGetListAllByPath(this.curPath)
          }
        })
      })
    },

    // 是否为图片，图片则展示缩略图
    isImg (item) {
      return (this.imgExtList.indexOf(item.ext) != -1)
    },

    // 调用onRename方法
    onRenameBtn () {
      if (this.selectedList.length > 1) return
      let item = this.selectedList[0]
      this.onRename(item)
    },

    // 调用onDel方法
    onDelBtn () {
      if (this.selectedList.length == 0) return
      let idList = this.selectedList.map(item => {
        return {
          type: item.type,
          id: item.id
        }
      })
      this.onDel(null, idList)
    },

    // 图片预览，图片资源DOM右下角有个放大镜，点击可以预览
    onPreviewImg (item) {
      if (this.selectedList.length > 2) return
      let path = item.img_path
      let alias = item.alias
      this.imgPreview.path = path
      this.imgPreview.alias = alias

      let screenWidth = $('body').width()
      let img = new Image()
      img.src = path
      img.onload = () => {
        let imgWidth = Number(img.width)
        let res = 0
        res = imgWidth > screenWidth ? screenWidth : imgWidth
        this.imgPreview.width = res + 'px'
        this.imgPreview.visible = true
      }
      item.isShowContextmenu = false
    },

    // 上传，触发隐藏按钮点击事件
    onUploadBtn () {
      let el = this.$refs.qqfile
      el.click()
    },

    // 发出事件，由上级组件处理
    onUpload () {
      let el = this.$refs.qqfile
      let files = el.files
      this.$emit('upload', files, this.curFid)
    },

    // 复制，记录复制项到待命数组，取消剪切状态
    onCopyBtn () {
      if (this.selectedList.length == 0) return
      this.isCut = false
      this.copyList = this.selectedList.map(item => ({
        id: item.id,
        type: item.type
      }))
    },

    // 复制，记录复制项到待命数组，取消剪切状态
    onCopy (item) {
      this.isCut = false
      if (this.selectedList.length > 1) {
        this.copyList = [...this.selectedList].map(item => ({
          id: item.id,
          type: item.type
        }))
      } else {
        this.copyList = [{
          id: item.id,
          type: item.type
        }]
      }

      item.isShowContextmenu = false
    },

    // 剪切，记录复制项到待命数组，设置成剪切状态
    onCutBtn () {
      if (this.selectedList.length == 0) return
      this.copyList = this.selectedList
      this.isCut = true
    },

    // 剪切，记录复制项到待命数组，设置成剪切状态
    onCut (item) {
      this.onCopy(item)
      this.isCut = true
    },

    // 粘贴，根据剪切状态，调用doPasetOnCut或doPaset
    onPasetBtn () {
      let idList = this.copyList
      let distId = this.curFid
      if (this.isCut) {
        this.doPasetOnCut(distId, idList)
      } else {
        this.doPaset(distId, idList)
      }
    },

    // 粘贴，不删除原文件
    doPaset (distId, idList) {
      $.post(APIURL.PASET, {
        _method: 'put',
        idList,
        distId
      }).then(res => {
        const {msg, status} = deJson(res)
        if (status == -1) {
          this.notify.error(msg)
          return
        }
        this.notify.succ('粘贴成功')
        this.onGetListAllByPath(this.curPath)
      })
    },

    // 粘贴，并删除原文件
    doPasetOnCut (distId, idList) {
      $.post(APIURL.PASET_CUT, {
        _method: 'put',
        distId,
        idList
      }).then(res => {
        const {msg, status} = deJson(res)
        if (status == -1) {
          this.notify.error(msg)
        }
        this.isCut = false
        this.onGetListAllByPath(this.curPath)
      })
    },

    // 右键菜单
    onContextmenu (event) {
      let vm = this
      this.$contextmenu({
        items: [{
          label: '刷新',
          onClick () {
            vm.onGetListAllByPath(vm.curPath).then(() => {
              vm.notify.info('已更新')
            })
          }
        }, {
          label: '新建文件夹',
          onClick () {
            vm.onNewFolder()          
          }
        }, {
          label: '粘贴',
          disabled: !vm.copyList.length,
          onClick () {
            if (vm.isCut) {
              vm.doPasetOnCut(vm.curFid, vm.copyList)
            } else {
              vm.doPaset(vm.curFid, vm.copyList)
            }
          }
        }],
        event
      })
      return false
    },

    // 初始化框选
    initDragSelect () {

      let vm = this

      dragSelect({
        container: '.mainBodyList',
        item: '.mainBodyListItem',
      }, {
        
        /**
         * 选中回调，elArr为当前选中项
         * 更新选中项的DOM状态，更新数组
         */
        selectedFn (elArr) {

          vm.curFolderData.forEach(item => (item.selected = false))
          let mapData = []
          $(elArr).each((i, el) => {
            let index = $(el).data('index')
            vm.curFolderData[index].selected = true
            mapData.push(vm.curFolderData[index])
          })

          vm.selectedList = mapData
        }
      })
    },

    /**
     * 全选按钮点击事件
     * 通过更新selectedList间接改变DOM状态
     */
    onSelectAll () {
      if (this.isSelectAll) {
        this.selectedList.forEach(item => (item.selected = false))
        this.selectedList = []
      } else {
        this.selectedList = [...this.curFolderData]
        this.selectedList.forEach(item => (item.selected = true))
      }
    }
  },
  watch: {

    // path改变，更新当前文件夹数据
    '$route.fullPath' () {
      let path = this.$route.query.path
      this.onGetListAllByPath(path)
    },

    // 上传完成，更新当前数据
    allUploadComplete () {
      this.onGetListAllByPath(this.curPath)
      this.$refs.qqfile.value = ''
    },

    // F2键盘事件，重命名
    appKeyF2 () {
      if (this.selectedList.length === 1) {
        let item = this.selectedList[0]
        this.onRename(item)
      }
    },

    // 复制
    appKeyCtrlC () {
      if (this.selectedList.length > 0) {
        this.onCopyBtn()
        this.notify.info('已复制')
      }
    },

    // 粘贴
    appKeyCtrlV () {
      if (this.copyList.length) {
        this.onPasetBtn()
      } else {
        this.notify.info('请先复制东西')
      }
    }
  },
  computed: {
    ...mapState('index', ['allUploadComplete']),
    ...mapState(['appClick', 'appKeyF2', 'appKeyCtrlC', 'appKeyCtrlV']),
    notify () {
      return notify(this)
    },
    isSelectAll () {
      if (this.curFolderData.length === 0) return false
      return (this.selectedList.length === this.curFolderData.length)
    }
  },
  mounted () {

    // 初始化path
    let path = this.$route.query.path
    if (!path) {
      this.$router.push({
        name: 'indexIndex',
        query: { path: '/' }
      })
    } else {
      this.onGetListAllByPath(path)
    }
  }
}





export default vm
</script>

<style scoped>

.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-menu-vertical-demo {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.mainBodyHeader {
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid #eee;
}


.mainBodyHeader .btn {
  margin-top: 11px;
}

.mainBodyListWrap {
  flex: 1;
  position: relative;
}

.mainBodyListScroll {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.mainBodyList {
  position: relative;
  box-sizing: border-box;
  padding: 16px;
}

.mainBodyList .item {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  background-color: #f9f9f9;
  overflow: hidden;
  transition: .2s background, .2s border;
  cursor: pointer;
  outline: none;
  float: left;
  margin: 0 10px 10px 0;
}
.mainBodyList .item:hover {
  border-color: #333;
}
.mainBodyList .itemActive {
  border-color: #333;
}

.mainBodyList .itemImg:hover {
  background-color: #fff !important;
}

.mainBodyList .item .icon {
  font-size: 38px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mainBodyList .item .text {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 20px;
  padding: 0 10px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.mainBodyCrumb {
  height: 30px;
  padding: 0 10px;
  line-height: 30px;
}

.contextmenuPop {
  width: 100px;
}

.fileContextmenu {}
.fileContextmenu div {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  transition: .2s background;
  cursor: pointer;
}
.fileContextmenu div:first-of-type {
  border-bottom: 1px solid #eee;
}
.fileContextmenu div:hover {
  background-color: #ddd;
}
.fileContextmenu div.disabled {
  color: #ddd !important;
  background-color: #fff !important;
}

.crumbItem >>> .el-breadcrumb__inner {
  float: left;
  max-width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.imgPreviewBtn {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 24px;
  height: 24px;
  background: rgba(0,0,0, .5);
  text-align: center;
  line-height: 24px;
}

.imgPreviewBtnIcon{
  position: relative;
  top: -1px;
  left: 0;
  color: #fff;
  font-size: 20px;
}



.itemSelectIcon {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
  z-index: 2;
  text-align: center;
  background-color: #fff;
  border: 1px solid #dadada;
  font-weight: bold;
  color: #cbcbcb;
}
.itemSelectIconIcon {}

.mainBodyList .item:hover .itemSelectIcon,
.mainBodyList .itemActive .itemSelectIcon {
  display: block;
}

.mainBodyList .itemActive .itemSelectIconIcon {
  color: #00adff;
}

.checkAllBar {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
}

.checkAllBar .tip {
  display: inline-block;
  font-size: 14px;
  color: #666;
  margin-left: 16px;
}
.checkAllBar .tip span {
  color: #00adff;
  font-weight: bold;
}
.menuItem2Badge >>> sup {
  top: 10px;
}

</style>