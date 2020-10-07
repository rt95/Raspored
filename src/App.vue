<template>
  <div id="app">
    <vubHeader v-if="currentUser"></vubHeader>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import vubHeader from './components/vubHeader.vue'
export default {
  name: 'app',
  components: {
    vubHeader
  },
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<style>
#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  padding-top: 50px;
}

@media (min-width: 2300px) {
  body {
    padding-top: 10vh;
  }
}
</style>
