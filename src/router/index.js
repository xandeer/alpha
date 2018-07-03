import Vue from 'vue'
import Router from 'vue-router'

import Lists from '../modules/lists'
import Add from '../modules/add'
import Edit from '../modules/edit'
import Login from '../modules/login'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/add',
      name: 'Add',
      component: Add
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/edit/:index',
      name: 'Edit',
      component: Edit
    },
    {
      path: '*',
      name: 'Lists',
      component: Lists
    }
  ]
})