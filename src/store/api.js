import axios from 'axios'

function verifyMinified() {}

const isProduction =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
  verifyMinified.name !== 'verifyMinified'

const http = axios.create({
  baseURL: isProduction ? 'http://xandeer.top/api/alpha' : 'http://localhost:3000',
  timeout: 1000
})

function init(token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

async function login(userInfo) {
  const res = await http.post('/signin', userInfo)
  const token = res.data
  init(token)
  localStorage.setItem('jwt-token', token)
  return res
}

async function getVersion() {
  const res = await http.get('/version')
  return res.data
}

async function insertItem(item) {
  const res = await http.post('/items', JSON.stringify(item))
  return res.data.version
}

async function updateItem(item) {
  const res = await http.put('/items', JSON.stringify(item))
  return res.data.version
}

async function deleteItemById(id) {
  const res = await http.delete(`/items/${id}`)
  return res.data.version
}

async function pullOperates(version) {
  const res = await http.get(`/operates/${version}`)
  return res.data
}

export default {
  init,
  login,
  getVersion,
  insertItem,
  updateItem,
  deleteItemById,
  pullOperates
}