import zango from 'zangodb/dist/zangodb.min'

const OPERATE_TYPE = {
  INSERT: 0,
  UPDATE: 1,
  DELETE: 2,
}

let itemsCollection
let operatesCollection
let metadataCollection

function init() {
  const itemDb = new zango.Db('alpha/items', {
    items: ['_id'],
  })
  itemsCollection = itemDb.collection('items')
  const operateDb = new zango.Db('alpha/operates', {
    operates: ['_id'],
  })
  operatesCollection = operateDb.collection('operates')

  const metadataDb = new zango.Db('alpha/metadata', {
    metadata: ['_id'],
  })
  metadataCollection = metadataDb.collection('metadata')
  window.mc = metadataCollection
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

async function getItemById(id) {
  const item = await itemsCollection.findOne({
    _id: id
  })

  return item
}

async function insertItem(item) {
  await updateMetadata(item)
  return itemsCollection.insert(item)
}

async function updateItem(id, newItem) {
  await updateMetadata(newItem)
  return itemsCollection.update({
    _id: id
  }, newItem, e => e && console.error(e))
}

async function deleteItem(id) {
  return itemsCollection.update({
    _id: id
  }, {
    removed: true
  }, e => e && console.error(e))
}

async function itemExisted(id) {
  return !!await itemsCollection.findOne({
    _id: id
  })
}

async function fetchOperates() {
  const operates = []
  await operatesCollection.find({})
    .sort({
      _id: 1
    })
    .forEach(item => {
      operates.unshift(item)
    })

  return operates
}

async function insertOperate(id, type) {
  const isExisted = !!await operatesCollection.findOne({
    _id: id
  })
  isExisted && await removeOperate(id)
  return operatesCollection.insert({
    _id: id,
    type,
  })
}

async function removeOperate(id) {
  return operatesCollection.remove({
    _id: id
  }, e => e && console.error(e))
}

async function updateMetadata({author, from, tags}) {
  !!author && await insertMetadata(author, 'author')
  !!from && await insertMetadata(from, 'from')
  tags && tags.forEach(async it => await insertMetadata(it, 'tag')) 
}

async function insertMetadata(value, type) {
  try {
    await metadataCollection.insert({
      _id: `${type}:${value}`,
      value,
      type
    })
  } catch (e) {}
}

async function startsWithMedatada(prefix, type) {
  const ret = []
  await metadataCollection.find({
    type
  }).forEach(({value}) => {
    value !== prefix && value.startsWith(prefix) && ret.unshift(value)
  })

  return ret
}

export default {
  init,
  fetchItems,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
  itemExisted,
  fetchOperates,
  insertOperate,
  removeOperate,
  startsWithMedatada,
}