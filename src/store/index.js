import Vue from 'vue'
import Vuex from 'vuex'
import index from './modules/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    index
  },
  state: {
    appClick: 0,
    appKeyF2: 0,
    appKeyCtrlC: 0,
    appKeyCtrlV: 0
  },
  mutations: {
    onAppClick (state, num) {
      state.appClick = num
    },
    appKeyF2 (state, num) {
      state.appKeyF2 = num
    },
    appKeyCtrlC (state, num) {
      state.appKeyCtrlC = num
    },
    setAppKeyCtrlV (state, num) {
      state.appKeyCtrlV = num
    }
  },
  actions: {
    setAppClick ({commit}, num) {
      commit('onAppClick', num)
    },
    setAppKeyF2 ({commit}, num) {
      commit('appKeyF2', num)
    },
    setAppKeyCtrlC({commit}, num) {
      commit('appKeyCtrlC', num)
    },
    setAppKeyCtrlV ({commit}, num) {
      commit('setAppKeyCtrlV', num)
    }
  }
})