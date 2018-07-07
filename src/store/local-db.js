import zango from 'zangodb/dist/zangodb.min'
import hash from 'object-hash'
import ObjectID from 'bson-objectid'


let itemsCollection

function init() {
  const alphaDb = new zango.Db('alpha', {
    items: ['_id']
  })
  itemsCollection = alphaDb.collection('items')
}

async function fetchItems(filter) {
  const items = []
  // for filter array item, but zangodb not support it.
  let tag
  if (filter.tag) {
    tag = filter.tag
    delete filter.tag
  }
  await itemsCollection.find(filter)
    .sort({
      created: 1
    })
    .forEach(item => {
      if (tag) {
        item.tags.includes(tag) && items.unshift(item)
      } else {
        items.unshift(item)
      }
    })

  return items
}

function insertItem(item) {
  return itemsCollection.insert(item)
}

function updateItem(id, newItem) {
  return dbCollection.update({
    _id: id
  }, newItem, e => e && console.error(e))
}

function deleteItem(item) {
  return itemsCollection.update({
    _id: item._id
  }, {
    removed: true
  }, e => e && console.error(e))
}

async function existed(id) {
  return !!await itemsCollection.findOne({
    _id: id
  })
}

export default {
  init,
  fetchItems,
  insertItem,
  updateItem,
  deleteItem,
  existed,
}