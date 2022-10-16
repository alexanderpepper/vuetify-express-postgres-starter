import BaseService from './BaseService'
import api from '../constants/api.js'

class SignInService extends BaseService {
  static signIn (user) {
    const { username, password } = user
    return this.POST(api.signIn, { username, password })
  }
}

export default SignInService
