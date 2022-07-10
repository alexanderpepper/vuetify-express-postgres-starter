import BaseService from './BaseService'
import api from '../constants/api.js'

class SignInService extends BaseService {
  static signIn (credentials) {
    return this.POST(api.signIn, credentials).then(accessToken => {
      this.saveAccessToken(accessToken)
      return accessToken
    })
  }
  static saveAccessToken (signInResponse) {
    window.localStorage['token'] = signInResponse.accessToken
    window.localStorage['user'] = signInResponse.id
    window.localStorage['tokenExpirationDate'] = signInResponse.expirationDate
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
