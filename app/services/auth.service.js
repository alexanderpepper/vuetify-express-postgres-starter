const db = require('../models')

const User = db.user
const { withoutNullsOrKeys } = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')
const { Op } = require('sequelize')
const smsService = require('../services/sms.service')
const emailService = require('../services/email.service')
const userService = require('../services/user.service')

exports.signUp = async user => {
  const saved = await User.create({
    ...withoutNullsOrKeys(user, ['passwordResetCode']),
    password: module.exports.encryptPassword(user.password),
    activationCode: uuid(),
    isActivated: false
  })
  await saved.setRoles([1])
}

exports.encryptPassword = password => {
  return bcrypt.hashSync(password, 8)
}

exports.validatePassword = (sentPassword, actualPassword) => {
  return sentPassword && actualPassword && bcrypt.compareSync(sentPassword, actualPassword)
}

exports.checkPassword = async ({ id, password }) => {
  const user = await userService.findById(id)
  if (user && exports.validatePassword(password, user.password)) {
    return user
  } else {
    return null
  }
}

exports.changePassword = async ({ id, oldPassword, newPassword }) => {
  const user = await module.exports.checkPassword({ id, password: oldPassword })
  if (user) {
    user.password = exports.encryptPassword(newPassword)
    user.save()
    return true
  } else {
    return false
  }
}

exports.getSecurityQuestions = async ({ username, phone, birthday }) => {
  const user = await User.findOne({
    attributes: ['securityQuestion1', 'securityQuestion2'],
    where: {
      [Op.and]: [
        { username },
        { phone },
        { birthday }
      ]
    }
  })
  if (user) {
    return user.get({ plain: true })
  } else {
    return null
  }
}

exports.activate = async ({ activationCode }) => {
  const user = await User.findOne({
    where: { activationCode }
  })
  if (user) {
    user.isActivated = true
    user.activationCode = null
    user.save()
    return true
  } else {
    return false
  }
}

exports.sendActivationLink = async ({ username, sendViaSms }) => {
  const user = await User.findOne({ where: { username } })
  if (user) {
    if (sendViaSms) {
      await smsService.sendActivationLink(user)
    } else {
      await emailService.sendActivationLink(user)
    }
    return true
  } else {
    return false
  }
}

exports.sendPasswordResetLink = async ({ username, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2, sendViaSms }) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [
        { username },
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
    return true
  } else {
    return false
  }
}

exports.sendUsername = async ({ phone, birthday, sendViaSms }) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [
        { phone },
        { birthday }
      ]
    }
  })
  if (user) {
    if (sendViaSms) {
      await smsService.sendUsername(user)
    } else {
      await emailService.sendUsername(user)
    }
    return true
  } else {
    return false
  }
}

exports.verifySecurityQuestions = async ({ username, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2 }) => {
  return await User.findOne({
    attributes: ['email', 'phone'],
    where: {
      [Op.and]: [
        { username },
        { securityQuestion1 },
        { securityQuestion2 },
        { securityAnswer1 },
        { securityAnswer2 }
      ]
    }
  })
}

exports.getSendOptions = async ({ phone, birthday }) => {
  return await User.findOne({
    where: {
      [Op.and]: [
        { phone },
        { birthday }
      ]
    }
  })
}

exports.resetPassword = async ({ username, password, passwordResetCode }) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [
        { username },
        { passwordResetCode }
      ]
    }
  })
  if (user) {
    user.passwordResetCode = null
    user.password = bcrypt.hashSync(password, 8)
    user.save()
    return user
  } else {
    return null
  }
}
