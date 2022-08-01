import BaseService from './BaseService'
import api from '../constants/api.js'

class UserService extends BaseService {
  static activate (activationCode) {
    return this.POST(api.activate, { activationCode })
  }

  static sendActivationLink (user) {
    return this.POST(api.sendActivationLink, user)
  }

  static sendUsername (user) {
    return this.POST(api.sendUsername, user)
  }

  static sendPasswordResetLink (user) {
    return this.POST(api.sendPasswordResetLink, user)
  }

  static getSecurityQuestions (user) {
    return this.POST(api.getSecurityQuestions, user)
  }

  static verifySecurityQuestions (user) {
    return this.POST(api.verifySecurityQuestions, user)
  }

  static getSendOptions (user) {
    return this.POST(api.getSendOptions, user)
  }

  static resetPassword (user) {
    return this.POST(api.setPassword, user)
  }

  static all () {
    return this.GET(api.users)
  }

  static get (id) {
    return this.GET(api.user(id))
  }

  static register (user) {
    delete user.confirmPassword
    return this.POST(api.signUp, user)
  }

  static save (user) {
    delete user.confirmPassword
    if (user.id) {
      return this.PUT(api.user(user.id), user)
    } else {
      return this.POST(api.users, user)
    }
  }

  static remove (user) {
    return this.DELETE(api.user(user.id))
  }

  static me () {
    return this.GET(api.me)
  }

  static saveAccount (user) {
    return this.PUT(api.account, user)
  }

  static account () {
    return this.GET(api.account)
  }

  static changePassword (password) {
    return this.POST(api.password, password)
  }
}

export default UserService
