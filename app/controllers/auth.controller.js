const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const TOKEN_VALIDITY_PERIOD = 86400
const { withoutNullsOrKeys } = require('../utilities/object.utilities')
const { Op } = require('sequelize')

exports.signUp = async (req, res) => {
  const data = withoutNullsOrKeys(req.body, ['activationCode', 'passwordResetCode', 'isActivated'])
  data.password = bcrypt.hashSync(req.body.password, 8)
  const user = await User.create(data)
  await user.setRoles([1])
  res.send('User was registered successfully!')
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
  const user = await User.findOne({
    attributes: ['securityQuestion1', 'securityQuestion2'],
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { username: req.body.identifier },
            { email: req.body.identifier }
          ]
        },
        { phone: req.body.phone },
        { birthday: req.body.birthday }
      ]
    }
  })
  if (user) {
    res.json(user.get({ plain: true }))
  } else {
    res.status(400).send({ messages: ['Account not found'] })
  }
}

exports.activate = async (req, res) => {
  res.json({})
}

exports.sendActivationLink = async (req, res) => {
  res.json({})
}

exports.sendPasswordResetLink = async (req, res) => {
  res.json({})
}

exports.verifySecurityQuestions = async (req, res) => {
  res.json({})
}

exports.getSendOptions = async (req, res) => {
  res.json({})
}

exports.sendUsername = async (req, res) => {
  res.json({})
}

exports.resetPassword = async (req, res) => {
  res.json({})
}
