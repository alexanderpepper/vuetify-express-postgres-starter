const credentials = require('../config/aws.config')
const AWS = require('aws-sdk')
const host = 'http://localhost:8080'

if (credentials.accessKeyId) {
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey
  })
}

module.exports = {
  sendSupportMessage: function (message) {
    return this.sendEmail({
      to: credentials.supportEmail,
      subject: 'Support message from vuetify-express-postgresql-starter.com',
      message: `
        <h1>Support Message</h1>
        <p>From ${message.email}: </p>
        <p>${message.body}</p>
      `
    })
  },
  sendActivationLink: function (user, app) {
    return this.sendEmail({
      to: user.email,
      subject: 'vuetify-express-postgresql-starter – Activate your account',
      message: `
        <h1>Welcome to vuetify-express-postgresql-starter!</h1>
        <p>
          <span>You're almost there, just&nbsp;</span>
          <a href="${host}/activate/${user.activationCode}">click here</a> 
          <span>&nbsp;to verify your email address and activate your account.</span>
        </p>
      `
    })
  },
  sendPasswordResetLink: function (user, app) {
    return this.sendEmail({
      to: user.email,
      subject: 'vuetify-express-postgresql-starter – Reset your password',
      message: `
        <h1>Your vuetify-express-postgresql-starter Password Reset</h1>
        <p>
          <a href="${host}/reset-password/${user.passwordResetCode}">Click here</a>
          <span>&nbsp;to reset yor password.
        </p>
      `
    })
  },
  sendUsername: function (user, app) {
    return this.sendEmail({
      to: user.email,
      subject: 'vuetify-express-postgresql-starter – Username',
      message: `
        <h1>Your vuetify-express-postgresql-starter Username</h1>
        <p>
          <span>Your vuetify-express-postgresql-starter username is ${user.username}.&nbsp;</span>
          <a href="${host}/sign-in">Click here to Sign In</a>
        </p>
      `
    })
  },
  sendEmail: function ({ to, subject, message }) {
    console.log('\n\nSending email:\n')
    console.log(message)
    // return new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail({
    //   Destination: { ToAddresses: [process.env.NODE_ENV === 'production' ? to : 'alexander.pepper@gmail.com'] },
    //   Message: {
    //     Body: { Html: { Charset: 'UTF-8', Data: message } },
    //     Subject: { Charset: 'UTF-8', Data: subject }
    //   },
    //   Source: credentials.noReplyEmail
    // }).promise()
  }
}
