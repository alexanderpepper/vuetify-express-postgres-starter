const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      })
    }
    req.userId = decoded.id
    next()
  })
}

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId)
  const roles = await user.getRoles()
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'admin') {
      next()
      return
    }
  }
  res.status(403).send({ message: 'Unauthorized' })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
}
module.exports = authJwt
