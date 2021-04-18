<template>
  <div class="wrap">
    <div class="header">
      <div class="progressBar">
        <span class="text">总进度：</span>
        <div class="bar">
          <el-progress
            :percentage="totalProgress"
            class="elBar"
          ></el-progress>
        </div>
      </div>
    </div>
    <div class="bodyWrap">
      <div class="body">
        <div class="list">

          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              label="文件名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="progress"
              label="上传进度">
              <template slot-scope="scope">
                <el-progress
                  :percentage="scope.row.progress"
                ></el-progress>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'IndexProgress',
  data: () => ({}),
  computed: {
    ...mapState('index', {
      uploader: state => state.uploader,
      uploadFileList: state => state.uploadFileList,
      totalProgress: state => state.totalProgress
    }),
    tableData () {
      let res = this.uploadFileList.map(item => ({
        name: item.name,
        progress: item.progress
      }))
      return res
    }
  },
  mounted () {}
}
</script>

<style scoped>

.wrap {
  width: 100%;
  height: 100%;
}

.header {
  position: absolute;
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  border-bottom: 1px solid #eee;
}
.header .progressBar {
  width: 100%;
  height: 100%;
  display: flex;
}
.header .progressBar .text {
  width: 100px;
  text-align: center;
  line-height: 60px;
  font-size: 14px;
  color: #333;
}
.header .progressBar .bar {
  flex: 1;
  position: relative;
}

.header .progressBar .bar .elBar {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
}

.header .progressBar .bar .elBar,
.header .progressBar .bar .elBar >>> .el-progress-bar__outer {
  height: 10px !important;
}

.header .progressBar .bar .elBar >>> .el-progress-bar,
.header .progressBar .bar .elBar >>> .el-progress__text {
  position: relative;
  top: -5px;
}

.bodyWrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 61px;
}

.body {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

</style>