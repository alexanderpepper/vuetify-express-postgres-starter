const db = require('../models')

const User = db.user
const Role = db.role
const { withoutNullsOrKeys, withoutKeys } = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const ACCOUNT_ATTRIBUTES = { exclude: ['password', 'passwordResetCode', 'activationCode', 'authenticationFailures'] }
const ME_ATTRIBUTES = ['id', 'name', 'email', 'photo']

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
  const user = await User.findOne({
    attributes: ACCOUNT_ATTRIBUTES,
    where: { id },
    include: [roleRelationship]
  })
  return user && user.get({ plain: true })
}

exports.all = async () => {
  return await User.findAll({
    attributes: ['id', 'username', 'name', 'email'],
    include: [roleRelationship]
  })
}

exports.me = async ({ id }) => {
  let user = await User.findOne({
    attributes: ME_ATTRIBUTES,
    where: { id },
    include: [roleRelationship]
  })
  if (user) {
    user = user.get({ plain: true })
    user.roles.forEach(role => {
      user[`is${role.name}`] = true
    })
  }
  return user
}

exports.account = async ({ id }) => {
  const user = await User.findOne({
    attributes: ACCOUNT_ATTRIBUTES,
    where: { id },
    include: [roleRelationship]
  })
  return user && user.get({ plain: true })
}

exports.updateAccount = async user => {
  const data = withoutKeys(user, ['activationCode', 'passwordResetCode', 'id', 'password', 'authenticationFailures', 'isLocked', 'isActivated'])
  return await User.update(data, { where: { id: user.id } })
}

exports.findByUsername = async username => {
  return await User.findOne({ where: { username } })
}

exports.findById = async id => {
  return await User.findOne({ where: { id } })
}
