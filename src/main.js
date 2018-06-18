import 'normalize.css'

import Vue from 'vue'

import App from './app'
import store from './store'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App),
  mounted() {
    this.$store.dispatch('init')
  }
})