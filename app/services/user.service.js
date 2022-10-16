const db = require('../models')

const User = db.user
const Role = db.role
const { withoutNullsOrKeys, withoutKeys } = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const ACCOUNT_ATTRIBUTES = { exclude: ['password', 'passwordResetCode', 'activationCode'] }
const ME_ATTRIBUTES = ['id', 'name', 'email', 'photo']

const roleRelationship = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name'],
  through: { attributes: [] }
}

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
