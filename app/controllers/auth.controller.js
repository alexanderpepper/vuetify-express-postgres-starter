const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.me = (req, res) => {
  User.findOne({
    attributes: ['id', 'username', 'name'],
    where: { id: req.userId },
    include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }]
  }).then(user => res.json(user.get({ plain: true })))
}

exports.signUp = (req, res) => {
  User.create({ ...req.body, password: bcrypt.hashSync(req.body.password, 8) }).then(user => {
    user.setRoles([1]).then(() => {
      res.send({ message: 'User was registered successfully!' })
    })
  }).catch(err => res.status(500).send({ message: err.message }))
}

exports.signIn = (req, res) => {
  const { username, email } = req.body
  User.findOne({
    where: username ? { username } : { email },
    include: [{ model: Role, as: 'roles', through: { attributes: [] } }]
  }).then(user => {
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const accessToken = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
      res.status(200).send({ ...user.get({ plain: true }), accessToken })
    } else {
      return res.status(401)
    }
  }).catch(err => res.status(500).send({ message: err.message }))
}
