const db = require('../models')

const User = db.user
const Role = db.role
const { withoutNullsOrKeys, withoutKeys } = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')
const { Op } = require('sequelize')
const smsService = require('../services/sms.service')
const emailService = require('../services/email.service')
const ACCOUNT_ATTRIBUTES = { exclude: ['password', 'passwordResetCode', 'activationCode'] }
const ME_ATTRIBUTES = ['id', 'name', 'email', 'photo']

const roleRelationship = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name'],
  through: { attributes: [] }
}

// user stuff

exports.create = async user => {
  const data = {
    ...withoutNullsOrKeys(user, ['activationCode', 'passwordResetCode']),
    password: bcrypt.hashSync(user.password, 8)
  }
  const savedUser = await User.create(data)
  await savedUser.setRoles(data.roles.map(role => role.id))
  return savedUser
}

exports.update = async user => {
  const data = withoutKeys(user, ['activationCode', 'passwordResetCode', 'id', 'password'])
  await User.update(data, { where: { id: user.id }, returning: true })
  const savedUser = await User.findOne({ where: { id: user.id } })
  await savedUser.setRoles(data.roles.map(role => role.id))
  return savedUser
}

exports.delete = async ({ id }) => {
  return await User.destroy({ where: { id } })
}

exports.get = async ({ id }) => {
  const user = await User.findOne({
    attributes: ACCOUNT_ATTRIBUTES,
    where: { id },
    include: [roleRelationship]
  })
  return user.get({ plain: true })
}

exports.all = async () => {
  return await User.findAll({
    attributes: ['id', 'username', 'name', 'email'],
    include: [roleRelationship]
  })
}

exports.me = async ({ id }) => {
  const user = await User.findOne({
    attributes: ME_ATTRIBUTES,
    where: { id },
    include: [roleRelationship]
  })
  return user.get({ plain: true })
}

exports.account = async ({ id }) => {
  const user = await User.findOne({
    attributes: ACCOUNT_ATTRIBUTES,
    where: { id },
    include: [roleRelationship]
  })
  return user.get({ plain: true })
}

exports.updateAccount = async user => {
  const data = withoutKeys(user, ['activationCode', 'passwordResetCode', 'id', 'password'])
  return await User.update(data, { where: { id: user.id } })
}

// Begin Auth stuff

exports.register = async user => {
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

exports.findByIdentifier = async identifier => {
  return await User.findOne({
    where: {
      [Op.or]: [
        { email: identifier },
        { username: identifier }
      ]
    },
    raw: true
  })
}

exports.findById = async id => {
  return await User.findOne({ where: { id } })
}

exports.validatePassword = (sentPassword, existingPassword) => {
  return sentPassword && existingPassword && bcrypt.compareSync(sentPassword, existingPassword)
}

exports.changePassword = async ({ id, oldPassword, newPassword }) => {
  const user = await exports.findById(id)
  if (user && exports.validatePassword(oldPassword, user.password)) {
    user.password = exports.encryptPassword(newPassword)
    user.save()
    return true
  } else {
    return false
  }
}

exports.getSecurityQuestions = async ({ identifier, phone, birthday }) => {
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

exports.sendActivationLink = async ({ username, email, identifier, sendViaSms }) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: username || identifier },
        { email: email || identifier }
      ]
    }
  })
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

exports.sendPasswordResetLink = async ({ identifier, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2, sendViaSms }) => {
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

exports.verifySecurityQuestions = async ({ identifier, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2 }) => {
  return await User.findOne({
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

exports.resetPassword = async ({ identifier, password, passwordResetCode }) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { username: identifier },
            { email: identifier }
          ]
        },
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
