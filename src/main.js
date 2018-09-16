import 'normalize.css'
import 'element-ui/lib/theme-chalk/autocomplete.css'

import 'babel-core/register'
import 'babel-polyfill'
import Vue from 'vue'

import { Autocomplete } from 'element-ui'

import App from './app'
import store from './store'
import router from './router'


Vue.config.productionTip = false

Vue.component(Autocomplete.name, Autocomplete)

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