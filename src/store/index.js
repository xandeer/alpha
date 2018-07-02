import Vue from 'vue'
import Vuex from 'vuex'
import zango from 'zangodb/dist/zangodb.min'
import hash from 'object-hash'
import ObjectID from 'bson-objectid'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  items: [],
}

const mutations = {
  CLEAR_ITEMS(state) {
    state.items.splice(0, state.items.length)
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
  }
}

const getters = {
  getItemByIndex: state => index => state.items[index]
}

let dbCollection
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

function verifyMinified() {}

const isProduction =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
  verifyMinified.name !== 'verifyMinified'

let isInited = false
const http = axios.create({
  baseURL: isProduction ? 'http://xandeer.top/api/alpha' : 'http://localhost:3000',
  timeout: 1000
})
const actions = {
  async init({
    dispatch
  }) {
    const alphaDb = new zango.Db('alpha', {
      items: ['_id']
    })
    dbCollection = alphaDb.collection('items')
    window.c = dbCollection
    await dispatch('refreshItems')
  },
  async refreshItems({
    commit
  }, filter = defaultFilter) {
    commit('CLEAR_ITEMS')
    try {
      let tag
      if (filter.tag) {
        tag = filter.tag
        delete filter.tag
      }
      if (!isInited) {
        const version = localStorage.getItem('version') || 0
        const remoteVersion = (await http.get('/version')).data
        console.log(`version: ${version}, remoteVersion: ${remoteVersion}`)
        if (version < remoteVersion) {
          const operates = (await http.get(`/operates/${version}`)).data
          operates.forEach(operate => {
            let item = operate.Data
            switch (operate.Type) {
              case 0:
                dbCollection.insert(item)
                break;
              case 1:
                const srcHash = hash(item)
                const newItem = Object.assign({}, item, {
                  hash: srcHash
                })
                dbCollection.update({
                  _id: item._id
                }, newItem, e => e && console.error(e))
                break;
              case 2:
                dbCollection.update({
                  _id: item._id
                }, {
                  removed: true
                }, e => e && console.error(e))
                break;
            }
          })
          localStorage.setItem('version', remoteVersion)
        }
        isInited = true
      }
      dbCollection.find(filter)
        .sort({
          created: 1
        })
        .forEach(item => {
          if (tag) {
            item.tags.includes(tag) && commit('INSERT_ITEM', item)
          } else {
            commit('INSERT_ITEM', item)
          }
        })
    } catch (error) {
      console.error(error)
    }
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
    commit
  }, src) {
    const now = new Date()
    const item = Object.assign({
      _id: ObjectID.generate(),
      created: now.toISOString(),
      modified: now.toISOString(),
      removed: false,
      hash: hash(src)
    }, src)

    commit('INSERT_ITEM', item)
    dbCollection.insert(item)
    const version = (await http.post('/items', JSON.stringify(item))).data.version
    localStorage.setItem('version', version)
  },
  async remove({
    commit,
    state
  }, index) {
    const item = state.items[index]

    commit('REMOVE_ITEM', index)
    dbCollection.update({
      _id: item._id
    }, {
      removed: true
    }, e => e && console.error(e))
    const version = (await http.delete(`items/${_id}`)).data.version
    localStorage.setItem('version', version)
  },
  async update({
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
        modified: new Date().toISOString()
      }, oldItem, src, {
        hash: srcHash
      })
      commit('UPDATE_ITEM', {
        index,
        item: newItem
      })
      dbCollection.update({
        _id: oldItem._id
      }, newItem, e => e && console.error(e))
      const version = (await http.put('/items', newItem)).data.version
      localStorage.setItem('version', version)
    }
  },
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})