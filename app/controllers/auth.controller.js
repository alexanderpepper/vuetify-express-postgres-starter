const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailService = require('../services/email.service')
const smsService = require('../services/sms.service')
const { v4: uuid } = require('uuid')
const TOKEN_VALIDITY_PERIOD = 86400
const { withoutNullsOrKeys } = require('../utilities/object.utilities')
const { Op } = require('sequelize')

exports.signUp = async (req, res) => {
  const user = await User.create({
    ...withoutNullsOrKeys(req.body, ['passwordResetCode']),
    password: bcrypt.hashSync(req.body.password, 8),
    activationCode: uuid(),
    isActivated: false
  })
  await user.setRoles([1])
  res.json({
    status: 200,
    messages: ['User was registered successfully!']
  })
}

exports.signIn = async (req, res) => {
  const { identifier } = req.body
  const user = await User.findOne({
    attributes: ['id', 'password', 'isActivated'],
    where: {
      [Op.or]: [
        { email: identifier },
        { username: identifier }
      ]
    },
    raw: true
  })
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    if (user.isActivated) {
      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: TOKEN_VALIDITY_PERIOD })
      const expirationDate = new Date().getTime() + TOKEN_VALIDITY_PERIOD
      res.json({ id: user.id, token, expirationDate })
    } else {
      res.status(400).send({
        status: 400,
        messages: ['Account not activated']
      })
    }
  } else {
    res.status(401).send({
      status: 401,
      messages: ['Invalid username or password']
    })
  }
}

exports.changePassword = async (req, res) => {
  const user = await User.findOne({ where: { id: req.userId } })
  if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
    user.password = bcrypt.hashSync(req.body.newPassword, 8)
    user.save()
    res.json({ messages: ['Password updated successfully'] })
  }
}

exports.getSecurityQuestions = async (req, res) => {
  const { identifier, phone, birthday } = req.body
  const user = await User.findOne({
    attributes: ['securityQuestion1', 'securityQuestion2'],
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { username: identifier },
            { email: identifier }
          ]
        },
        { phone },
        { birthday }
      ]
    }
  })
  if (user) {
    res.json(user.get({ plain: true }))
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.activate = async (req, res) => {
  const { activationCode } = req.body
  const user = await User.findOne({
    where: { activationCode }
  })
  if (user) {
    user.isActivated = true
    user.activationCode = null
    user.save()
    res.json({
      status: 200,
      messages: ['User successfully activated.']
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.sendActivationLink = async (req, res) => {
  const { identifier, sendViaSms } = req.body
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: identifier },
        { email: identifier }
      ]
    }
  })
  if (user) {
    if (sendViaSms) {
      await smsService.sendActivationLink(user)
    } else {
      await emailService.sendActivationLink(user)
    }
    res.json({
      status: 200,
      messages: ['Activation link sent!']
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.sendPasswordResetLink = async (req, res) => {
  const { identifier, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2, sendViaSms } = req.body
  const user = await User.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { username: identifier },
            { email: identifier }
          ]
        },
        { securityQuestion1 },
        { securityQuestion2 },
        { securityAnswer1 },
        { securityAnswer2 }
      ]
    }
  })
  if (user) {
    user.passwordResetCode = uuid()
    user.save()
    if (sendViaSms) {
      await smsService.sendPasswordResetLink(user)
    } else {
      await emailService.sendPasswordResetLink(user)
    }
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.verifySecurityQuestions = async (req, res) => {
  const { identifier, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2 } = req.body
  const user = await User.findOne({
    attributes: ['email', 'phone'],
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { username: identifier },
            { email: identifier }
          ]
        },
        { securityQuestion1 },
        { securityQuestion2 },
        { securityAnswer1 },
        { securityAnswer2 }
      ]
    }
  })
  if (user) {
    res.json({ email: obscuredEmail(user), phone: obscuredPhone(user) })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.getSendOptions = async (req, res) => {
  const { phone, birthday } = req.body
  const user = await User.findOne({
    attributes: ['email', 'phone'],
    where: {
      [Op.and]: [
        { phone },
        { birthday }
      ]
    }
  })
  if (user) {
    res.json({ email: obscuredEmail(user), phone: obscuredPhone(user) })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.sendUsername = async (req, res) => {
  res.json({})
}

exports.resetPassword = async (req, res) => {
  res.json({})
}

function obscuredPhone (user) {
  if (user.phone) {
    const lastDigits = user.phone.substr(user.phone.length - 2)
    return user.isInternationalPhone ? `+•• •••••••••${lastDigits}` : `(•••) •••-••${lastDigits}`
  } else {
    return ''
  }
}

function obscuredEmail (user) {
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
