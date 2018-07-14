import utils from '../utils'

export default {
  urlPrefix: utils.isProduction ? 'http://xandeer.top/api/alpha' : 'http://localhost:3000',
  timeout: 1000
}