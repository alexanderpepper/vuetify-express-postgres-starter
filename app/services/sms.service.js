const credentials = require('../config/twilio.config')
const Twilio = require('twilio')
const client = credentials.accountSid ? new Twilio(credentials.accountSid, credentials.authToken) : {}
const host = 'http://localhost:8080'

module.exports = {
  sendActivationLink: function (user, app) {
    return this.sendSms(user, `Welcome to vuetify-express-postgresql-starter! Click the following link to verify your mobile phone number and activate your account: ${host}/activate/${user.activationCode}`)
  },
  sendPasswordResetLink: function (user, app) {
    return this.sendSms(user, `Hi from vuetify-express-postgresql-starter. Click the following link to reset your password: ${host}/reset-password/${user.passwordResetCode}`)
  },
  sendUsername: function (user) {
    return this.sendSms(user, `Your vuetify-express-postgresql-starter username is ${user.username}`)
  },
  sendSms: function (user, body) {
    console.log(body)
    // return client.messages.create({
    //   body,
    //   from: '+12108888888',
    //   to: process.env.NODE_ENV === 'production' ? `+1${user.phone}` : '+12108842123'
    // })
  }
}
