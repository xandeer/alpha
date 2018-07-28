import Vue from 'vue'
import Router from 'vue-router'

import Lists from '../modules/lists'
import Add from '../modules/add'
import Edit from '../modules/edit'
import Login from '../modules/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/add',
      name: 'add',
      component: Add
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/edit/:index',
      name: 'edit',
      component: Edit
    },
    {
      path: '/items',
      name: 'items',
      component: Lists,
    },
    {
      path: '*',
      redirect: '/items'
    }
  ]
})