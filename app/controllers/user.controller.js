const db = require('../models')
const { withoutKeys, withoutNullsOrKeys} = require('../utilities/object.utilities')
const bcrypt = require('bcryptjs')
const User = db.user
const Role = db.role
const ACCOUNT_ATTRIBUTES = { exclude: ['password', 'passwordResetCode', 'activationCode'] }
const ME_ATTRIBUTES = ['id', 'name']

const roleRelationship = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name'],
  through: { attributes: [] }
}

exports.me = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ME_ATTRIBUTES,
      where: { id: req.userId },
      include: [roleRelationship]
    })
    res.json(user.get({ plain: true }))
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}

exports.account = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ACCOUNT_ATTRIBUTES,
      where: { id: req.userId },
      include: [roleRelationship]
    })
    res.json(user.get({ plain: true }))
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}

exports.updateAccount = async (req, res) => {
  try {
    if (req.userId !== req.body.id) {
      res.status(403).send({ message: 'Unauthorized' })
    }
    const data = withoutKeys(req.body, ['activationCode', 'passwordResetCode', 'id', 'password'])
    const id = await User.update(data, { where: { id: req.body.id } })
    res.json({ id })
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}

exports.all = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [roleRelationship]
    })
    res.json(users)
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}

exports.get = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ACCOUNT_ATTRIBUTES,
      where: { id: req.params.id },
      include: [roleRelationship]
    })
    res.json(user.get({ plain: true }))
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}

exports.create = async (req, res) => {
  try {
    const data = withoutNullsOrKeys(req.body, ['activationCode', 'passwordResetCode'])
    data.password = bcrypt.hashSync(req.body.password, 8)
    const user = await User.create(data)
    res.json({ id: user.id })
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}

exports.update = async (req, res) => {
  try {
    const data = withoutKeys(req.body, ['activationCode', 'passwordResetCode', 'id', 'password'])
    const [, user] = await User.update(data, { where: { id: req.body.id }, returning: true })
    res.json({ id: user.id })
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}
