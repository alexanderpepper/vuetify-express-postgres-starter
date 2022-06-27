import BaseService from './BaseService'
import api from '../constants/api.js'

class SignInService extends BaseService {
  static signIn (credentials) {
    return this.POST(api.signIn, credentials).then(accessToken => {
      console.log(accessToken)
      this.saveAccessToken(accessToken)
      return accessToken
    })
  }
  static saveAccessToken (accessToken) {
    window.localStorage['token'] = accessToken.accessToken
    window.localStorage['user'] = accessToken.userId
  }
  static logout () {
    delete window.localStorage['token']
    delete window.localStorage['user']
  }
  static hasAccessToken () {
    return window.localStorage['token'] && window.localStorage['user']
  }
}

export default SignInService
