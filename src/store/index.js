import Vue from 'vue'
import Vuex from 'vuex'
import zango from 'zangodb/dist/zangodb.min'
import hash from 'object-hash'
import ObjectID from 'bson-objectid'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  items: [],
  isSignined: false
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
  },
  UPDATE_TOKEN(state, token) {
    localStorage.setItem("jwt-token", token)
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`
    state.isSignined = true
    isInited = false
  },
  SIGNOUT(state) {
    state.isSignined = false
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
    commit,
    dispatch
  }) {
    const alphaDb = new zango.Db('alpha', {
      items: ['_id']
    })
    dbCollection = alphaDb.collection('items')
    window.c = dbCollection
    http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwt-token')}`
    try {
      const token = localStorage.getItem('jwt-token')
      if (token) {
        commit('UPDATE_TOKEN', token)
        await http.post('/signin', '')
      }
    } catch (error) {
      commit('SIGNOUT')
      console.log(error)
    }
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
        try {
          const version = localStorage.getItem('version') || 0
          const remoteVersion = (await http.get('/version')).data
          console.log(`version: ${version}, remoteVersion: ${remoteVersion}`)
          if (version < remoteVersion) {
            const operates = (await http.get(`/operates/${version}`)).data
            operates.forEach(async operate => {
              const item = operate.Data
              if (operate.Type == 0 || !await dbCollection.findOne({_id: item.id})) {
                dbCollection.insert(item)
              } else {
                switch (operate.Type) {
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
              }
            })
            localStorage.setItem('version', remoteVersion)
          }
          isInited = true
        } catch (e) {
          console.error(e)
        }
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
      created: now.toJSON(),
      modified: now.toJSON(),
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
    const version = (await http.delete(`/items/${item._id}`)).data.version
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
        modified: (new Date()).toJSON()
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
  async login({
    commit
  }, userInfo) {
    const res = await http.post('/signin', userInfo)
    const token = res.data

    commit("UPDATE_TOKEN", token)
  },
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})