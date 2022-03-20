import BaseService from './BaseService'
import api from '../constants/api.js'

class LoginService extends BaseService {
  static login (credentials) {
    return this.POST(api.login, credentials, true).then(accessToken => {
      this.saveAccessToken(accessToken)
      return accessToken
    })
  }
  static saveAccessToken (accessToken) {
    window.localStorage['token'] = accessToken.id
    window.localStorage['user'] = accessToken.userId
  }
  static logout () {
    return this.POST(api.logout, true).finally(() => {
      delete window.localStorage['token']
      delete window.localStorage['user']
    })
  }
  static hasAccessToken () {
    return window.localStorage['token'] && window.localStorage['user']
  }
}

export default LoginService
