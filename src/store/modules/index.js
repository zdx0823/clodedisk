const state = {
  uploadFileList: [],
  totalProgress: 0,
  inProgressNum: 0,
  allUploadComplete: 0
}

const mutations = {
  uploadFile (state, file) {
    state.uploadFileList.push(file)
  },
  uploader (state, uploader) {
    state.uploader = uploader
  },
  totalProgress (state, totalProgress) {
    state.totalProgress = totalProgress
  },
  changeProgress (state, params) {
    let uuid = params[0]
    let p = params[1]
    let index = -1
    for (let i = 0, len = state.uploadFileList.length; i < len; i++) {
      if (state.uploadFileList[i].uuid == uuid) {
        index = i
        break
      }
    }
    
    let data = state.uploadFileList[index]
    data.progress = p
    state.uploadFileList.splice(index, 1, data)
  },
  inProgressNum (state, num) {
    state.inProgressNum = num
  },
  allUploadComplete (state, num) {
    state.allUploadComplete = num
  }
}

const actions = {
  uploadFile ({commit}, file) {
    commit('uploadFile', file)
  },
  uploader ({commit}, uploader) {
    commit('uploader', uploader)
  },
  setTotalProgress ({commit}, totalProgress) {
    commit('totalProgress', totalProgress)
  },
  changeProgress ({commit}, params) {
    commit('changeProgress', params)
  },
  setInProgressNum ({commit}, num) {
    commit('inProgressNum', num)
  },
  setAllUploadComplete ({commit}, num) {
    commit('allUploadComplete', num)
  }
}


const store = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default store