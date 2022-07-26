const db = require('../models')
const {withoutKeys, withoutNullsOrKeys} = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const User = db.user
const Role = db.role
const ACCOUNT_ATTRIBUTES = {exclude: ['password', 'passwordResetCode', 'activationCode']}
const ME_ATTRIBUTES = ['id', 'name', 'email']

const roleRelationship = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name'],
  through: {attributes: []}
}

exports.me = async (req, res) => {
  const user = await User.findOne({
    attributes: ME_ATTRIBUTES,
    where: {id: req.userId},
    include: [roleRelationship]
  })
  res.json(user.get({plain: true}))
}

exports.account = async (req, res) => {
  const user = await User.findOne({
    attributes: ACCOUNT_ATTRIBUTES,
    where: {id: req.userId},
    include: [roleRelationship]
  })
  res.json(user.get({plain: true}))
}

exports.updateAccount = async (req, res) => {
  if (req.userId !== req.body.id) {
    res.status(403).send({ message: 'Unauthorized' })
  }
  const data = withoutKeys(req.body, ['activationCode', 'passwordResetCode', 'id', 'password'])
  const id = await User.update(data, {where: {id: req.body.id}})
  res.json({id})
}

exports.all = async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'name', 'email'],
    include: [roleRelationship]
  })
  res.json(users)
}

exports.get = async (req, res) => {
  const user = await User.findOne({
    attributes: ACCOUNT_ATTRIBUTES,
    where: {id: req.params.id},
    include: [roleRelationship]
  })
  res.json(user.get({plain: true}))
}

exports.create = async (req, res) => {
  const data = withoutNullsOrKeys(req.body, ['activationCode', 'passwordResetCode'])
  data.password = bcrypt.hashSync(req.body.password, 8)
  const user = await User.create(data)
  await user.setRoles(data.roles.map(role => role.id))
  res.json({id: user.id})
}

exports.update = async (req, res) => {
  const data = withoutKeys(req.body, ['activationCode', 'passwordResetCode', 'id', 'password'])
  await User.update(data, {where: {id: req.body.id}, returning: true})
  const user = await User.findOne({
    where: {id: req.body.id}
  })
  await user.setRoles(data.roles.map(role => role.id))
  res.json({id: user.id})
}

exports.delete = async (req, res) => {
  await User.destroy({where: {id: req.params.id}})
  res.json('Deleted successfully')
}
