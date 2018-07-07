import Vue from 'vue'
import Vuex from 'vuex'
import hash from 'object-hash'
import ObjectID from 'bson-objectid'

import api from './api'
import db from './local-db'
import {
  PullError
} from './errors'

Vue.use(Vuex)

const state = {
  items: [],
  isSignined: false
}

const mutations = {
  REFRESH_ITEMS(state, items) {
    state.items.splice(0, state.items.length, ...items)
  },
  INSERT_ITEM(state, item) {
    state.items.unshift(item)
  },
  REMOVE_ITEM(state, index) {
    state.items.splice(index, 1)
  },
  UPDATE_ITEM(state, {
    index,
    item
  }) {
    state.items.splice(index, 1, item)
  },
  SIGNIN(state) {
    state.isSignined = true
  },
  SIGNOUT(state) {
    state.isSignined = false
  }
}

const getters = {
  getItemByIndex: state => index => state.items[index]
}

const defaultFilter = {
  $or: [{
    removed: {
      $exists: false
    }
  }, {
    removed: {
      $eq: false
    }
  }]
}

const actions = {
  async init({
    dispatch
  }) {
    const token = localStorage.getItem('jwt-token')
    api.init(token)
    db.init()
    token && await dispatch('login')
    try {
      await dispatch('push')
    } catch (error) {
      console.log('Failed to pull operates while init.')
    }
    await dispatch('refreshItems')
  },
  async pull() {
    const localVersion = localStorage.getItem('version') || 0
    try {
      const remoteVersion = await api.getVersion()
      console.log(`localVersion: ${localVersion}, remoteVersion: ${remoteVersion}`)
      if (localVersion < remoteVersion) {
        try {
          const operates = await api.pullOperates(localVersion)

          await operates.forEach(async operate => {
            const item = operate.Data
            if (operate.Type == 0 || !await db.itemExisted(item._id)) {
              db.insertItem(item)
            } else {
              switch (operate.Type) {
                case 1:
                  const srcHash = hash(item)
                  const newItem = Object.assign({}, item, {
                    hash: srcHash
                  })
                  db.updateItem(item._id, newItem)
                  break;
                case 2:
                  db.deleteItem(item._id)
                  break;
              }
            }
          })
          localStorage.setItem('version', remoteVersion)
        } catch (error) {
          console.log('Failed to pull operates.')
          throw new PullError()
        }
      }
    } catch (error) {
      console.log('Failed to get version while pulling operates.')
      throw new PullError()
    }
  },
  async push({
    dispatch,
    state,
  }) {
    try {
      await dispatch('pull')
      if (state.isSignined) {
        try {
          const operates = await db.fetchOperates()
          operates.forEach(async operate => {
            const item = await db.getItemById(operate._id)
            let version
            try {
              switch (operate.type) {
                case 0:
                  version = await api.insertItem(item)
                  break
                case 1:
                  version = await api.updateItem(item)
                  break
                case 2:
                  version = await api.deleteItemById(operate._id)
                  break
              }
              localStorage.setItem('version', version)
              await db.removeOperate(operate._id)
            } catch (error) {
              console.log('Failed to push item.')
            }
          })
        } catch (e) {
          console.log('Failed to fetch operates from local database.')
        }
      }
    } catch (e) {
      console.log('Failed to pull before push.')
    }
  },
  async refreshItems({
    commit
  }, filter = defaultFilter) {
    const items = await db.fetchItems(filter)
    commit('REFRESH_ITEMS', items)
  },
  filter({
    dispatch
  }, obj) {
    let f
    if (obj.author || obj.from || obj.tag) {
      f = Object.assign(obj, defaultFilter)
    }
    f && dispatch('refreshItems', f)
  },
  async add({
    commit,
    dispatch,
  }, src) {
    const now = new Date()
    const item = Object.assign({
      _id: ObjectID.generate(),
      created: now.toJSON(),
      modified: now.toJSON(),
      removed: false,
      hash: hash(src)
    }, src)

    commit('INSERT_ITEM', item)
    await db.insertItem(item)
    await db.insertOperate(item._id, 0)
    await dispatch('push')
  },
  async remove({
    dispatch,
    commit,
    state
  }, index) {
    const item = state.items[index]

    commit('REMOVE_ITEM', index)
    await db.deleteItem(item._id)
    await db.insertOperate(item._id, 2)
    await dispatch('push')
  },
  async update({
    dispatch,
    commit,
    state
  }, {
    index,
    item: src
  }) {
    const srcHash = hash(src)
    const oldItem = state.items[index]
    if (srcHash !== oldItem.hash) {
      const newItem = Object.assign({
        modified: (new Date()).toJSON()
      }, oldItem, src, {
        hash: srcHash
      })
      commit('UPDATE_ITEM', {
        index,
        item: newItem
      })
      await db.updateItem(oldItem._id, newItem)
      await db.insertOperate(newItem._id, 1)
      await dispatch('push')
    }
  },
  async login({
    commit
  }, userInfo = '') {
    try {
      await api.login(userInfo)
      commit('SIGNIN')
      return true
    } catch (error) {
      console.log(error.message)
      commit('SIGNOUT')
    }
    return false
  },
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})