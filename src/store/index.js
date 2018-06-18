import Vue from 'vue'
import Vuex from 'vuex'
import zango from 'zangodb/dist/zangodb.min'
import hash from 'object-hash'

Vue.use(Vuex)

const state = {
  items: []
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
const actions = {
  init({
    dispatch
  }) {
    const alphaDb = new zango.Db('alpha', {
      items: ['_id']
    })
    dbCollection = alphaDb.collection('items')
    window.c = dbCollection
    dispatch('refreshItems')
  },
  refreshItems({
    commit
  }, filter = defaultFilter) {
    commit('CLEAR_ITEMS')
    try {
      let tag
      if (filter.tag) {
        tag = filter.tag
        delete filter.tag
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
  add({
    commit
  }, src) {
    const now = new Date()
    const item = Object.assign({
      _id: `${Math.round(Math.random(47) * 887) + 100}${now.valueOf()}`,
      created: now.getTime(),
      hash: hash(src)
    }, src)

    commit('INSERT_ITEM', item)
    dbCollection.insert(item)
  },
  remove({
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
  },
  update({
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
        modified: new Date().getTime()
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
    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})