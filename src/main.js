import 'normalize.css'

import 'babel-core/register'
import 'babel-polyfill'
import Vue from 'vue'

import App from './app'
import store from './store'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
window.instance = new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App),
  created() {
    this.$store.dispatch('init')
  }
})