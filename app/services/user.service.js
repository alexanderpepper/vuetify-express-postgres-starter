const db = require('../models')
const User = db.user
const Role = db.role
const { withoutNullsOrKeys, withoutKeys } = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const ACCOUNT_ATTRIBUTES = { exclude: ['password', 'passwordResetCode', 'activationCode', 'authenticationFailures'] }
const ME_ATTRIBUTES = ['id', 'name', 'email', 'photo']
const USER_LIST_ATTRIBUTES = ['id', 'username', 'name', 'email']
const EXCLUDED_ACCOUNT_UPDATE_ATTRIBUTES = ['activationCode', 'passwordResetCode', 'id', 'password', 'authenticationFailures', 'isLocked', 'isActivated']
const { v4: uuid } = require('uuid')
const { Op } = require('sequelize')
const smsService = require('../services/sms.service')
const emailService = require('../services/email.service')

const roleRelationship = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name'],
  through: { attributes: [] }
}

exports.create = async user => {
  const data = {
    ...withoutNullsOrKeys(user, ['confirmPassword', 'activationCode', 'passwordResetCode', 'authenticationFailures', 'isLocked']),
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
  return User.destroy({ where: { id } })
}

exports.lock = async ({ id, isLocked }) => {
  return User.update({ isLocked }, { where: { id } })
}

exports.get = async ({ id }) => {
  const user = await exports.findByIdWithRoles(id, ACCOUNT_ATTRIBUTES)
  return user && user.get({ plain: true })
}

exports.all = async () => {
  return await User.findAll({
    attributes: USER_LIST_ATTRIBUTES,
    include: [roleRelationship]
  })
}

exports.me = async ({ id }) => {
  let user = await exports.findByIdWithRoles(id, ME_ATTRIBUTES)
  if (user) {
    user = user.get({ plain: true })
    user.roles.forEach(role => {
      user[`is${role.name}`] = true
    })
  }
  return user
}

exports.account = async ({ id }) => {
  const user = await exports.findByIdWithRoles(id, ACCOUNT_ATTRIBUTES)
  return user && user.get({ plain: true })
}

exports.updateAccount = async user => {
  const data = withoutKeys(user, EXCLUDED_ACCOUNT_UPDATE_ATTRIBUTES)
  return await User.update(data, { where: { id: user.id } })
}

exports.findByUsername = async username => {
  return User.findOne({ where: { username } })
}

exports.findById = async id => {
  return User.findOne({ where: { id } })
}

exports.findByIdWithRoles = async (id, attributes = undefined) => {
  return User.findOne({
    attributes,
    where: { id },
    include: [roleRelationship]
  })
}

exports.signUp = async user => {
  const saved = await User.create({
    ...withoutNullsOrKeys(user, ['passwordResetCode']),
    password: exports.encryptPassword(user.password),
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
  const user = await exports.findById(id)
  if (user && exports.validatePassword(password, user.password)) {
    return user
  } else {
    return null
  }
}

exports.changePassword = async ({ id, oldPassword, newPassword }) => {
  const user = await exports.checkPassword({ id, password: oldPassword })
  if (user) {
    user.password = exports.encryptPassword(newPassword)
    await user.save()
    return true
  } else {
    return false
  }
}

exports.getSecurityQuestions = async ({ username, birthday }) => {
  const user = await User.findOne({
    attributes: ['securityQuestion1', 'securityQuestion2'],
    where: {
      [Op.and]: [
        { username },
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
  if (user && !user.isActivated) {
    user.isActivated = true
    user.activationCode = null
    await user.save()
    return true
  } else {
    return false
  }
}

exports.sendActivationLink = async ({ username, sendViaSms }) => {
  const user = await User.findOne({ where: { username } })
  if (user && !user.isActivated) {
    user.activationCode = uuid()
    await user.save()
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

exports.findByUsernameAndSecurityQuestions = ({ username, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2, attributes = undefined }) => {
  return User.findOne({
    attributes,
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

exports.findByPhoneAndBirthday = ({ phone, birthday, attributes = undefined }) => {
  return User.findOne({
    where: {
      [Op.and]: [
        { phone },
        { birthday }
      ]
    }
  })
}

exports.sendPasswordResetLink = async ({ username, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2, sendViaSms }) => {
  const user = await exports.findByUsernameAndSecurityQuestions({ username, securityQuestion1, securityQuestion2, securityAnswer1, securityAnswer2 })
  if (user) {
    user.passwordResetCode = uuid()
    await user.save()
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
  const user = await exports.findByPhoneAndBirthday({ phone, birthday })
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
  return await exports.findByUsernameAndSecurityQuestions({
    username,
    securityQuestion1,
    securityQuestion2,
    securityAnswer1,
    securityAnswer2,
    attributes: ['email', 'phone']
  })
}

exports.getSendOptions = async ({ phone, birthday }) => {
  return await exports.findByPhoneAndBirthday({ phone, birthday })
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
    await user.save()
    return user
  } else {
    return null
  }
}
