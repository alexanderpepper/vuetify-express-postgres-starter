import BaseService from './BaseService'
import api from '../constants/api.js'

class SignInService extends BaseService {
  static signIn (credentials) {
    return this.POST(api.signIn, credentials)
  }
}

export default SignInService
