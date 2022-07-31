import BaseService from './BaseService'
import api from '../constants/api.js'

class SignInService extends BaseService {
  static signIn (user) {
    const { identifier, password } = user
    return this.POST(api.signIn, { identifier, password })
  }
}

export default SignInService
