import BaseService from './BaseService'
import api from '../constants/api.js'

class UserService extends BaseService {
  static activate (activationCode) {
    return this.POST(api.activate, { activationCode })
      .then(response => response.results)
  }

  static sendActivationLink (identifier, sendViaSms) {
    return this.POST(api.sendActivationLink, { options: { identifier, sendViaSms } })
      .then(response => response.results)
  }

  static sendUsername (user, sendViaSms) {
    return this.POST(api.sendUsername, { options: { user, sendViaSms } })
      .then(response => response.results)
  }

  static sendPasswordResetLink (user, sendViaSms) {
    return this.POST(api.sendPasswordResetLink, { options: { user, sendViaSms } })
      .then(response => response.results)
  }

  static getSecurityQuestions (user) {
    return this.POST(api.getSecurityQuestions, { user })
      .then(response => response.results)
  }

  static verifySecurityQuestions (user) {
    return this.POST(api.verifySecurityQuestions, { user })
      .then(response => response.results)
  }

  static getSendOptions (user) {
    return this.POST(api.getSendOptions, { user })
      .then(response => response.results)
  }

  static resetPassword (user) {
    return this.POST(api.resetPassword, { user })
      .then(response => response.results)
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

  static obscuredPhone (user) {
    if (user.phone) {
      const lastDigits = user.phone.substr(user.phone.length - 2)
      return user.isInternationalPhone ? `+•• •••••••••${lastDigits}` : `(•••) •••-••${lastDigits}`
    } else {
      return ''
    }
  }

  static obscuredEmail (user) {
    if (user.email) {
      const emailComponents = user.email.split('@')
      const username = emailComponents[0]
      const domain = emailComponents[1]
      const firstTwoCharacters = username.substring(0, 2)
      const lastTwoCharacters = username.substring(username.length - 2)
      return `${firstTwoCharacters}•••••••${lastTwoCharacters}@${domain}`
    } else {
      return ''
    }
  }
}

export default UserService
