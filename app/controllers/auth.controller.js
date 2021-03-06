const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const TOKEN_VALIDITY_PERIOD = 86400
const { withoutNullsOrKeys } = require('../utilities/object.utilities')

exports.signUp = async (req, res) => {
  try {
    const data = withoutNullsOrKeys(req.body, ['activationCode', 'passwordResetCode', 'isActivated'])
    data.password = bcrypt.hashSync(req.body.password, 8)
    const user = await User.create(data)
    await user.setRoles([1])
    res.send({ message: 'User was registered successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

exports.signIn = async (req, res) => {
  try {
    const { username, email } = req.body
    const user = await User.findOne({
      attributes: ['id', 'password'],
      where: username ? { username } : { email },
      raw: true
    })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const accessToken = jwt.sign({ id: user.id }, config.secret, { expiresIn: TOKEN_VALIDITY_PERIOD })
      res.status(200).send({
        accessToken,
        id: user.id,
        expirationDate: new Date().getTime() + TOKEN_VALIDITY_PERIOD
      })
    } else {
      res.status(401).send({ message: 'Invalid username or password' })
    }
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } })
    if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
      user.password = bcrypt.hashSync(req.body.newPassword, 8)
      user.save()
      res.status(200).send({ message: 'Password updated successfully' })
    }
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}
