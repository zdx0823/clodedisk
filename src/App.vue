<template>
  <div
    id="app"
    @click="onAppClick"
  >
    <router-view />
  </div>
</template>

<script>
import $ from 'jquery'
import {mapActions} from 'vuex'
export default {
  name: 'App',
  data: () => ({
    appClick: Date.now()
  }),
  methods: {
    ...mapActions(['setAppClick', 'setAppKeyF2', 'setAppKeyCtrlC', 'setAppKeyCtrlV']),
    onAppClick () {
      this.setAppClick(Date.now())
    }
  },
  mounted () {
    $(document).on('keyup', (event) => {
      let keyCode = event.keyCode
      let isCtrl = event.ctrlKey

      // f2按下
      if (keyCode === 113) {
        this.setAppKeyF2(Date.now())
      }

      // ctrl键
      if (isCtrl) {
        // C
        if (keyCode === 67) {
          this.setAppKeyCtrlC(Date.now())
        }

        // V
        if (keyCode === 86) {
          this.setAppKeyCtrlV(Date.now())
        }
      }
    })
  }
}
</script>

<style scoped>

#app {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
}

</style>
