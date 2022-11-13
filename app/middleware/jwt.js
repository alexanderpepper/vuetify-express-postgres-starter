const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.forbidden(['No token provided!'])
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.unauthorized(['Unauthorized, bad token!'])
    } else {
      req.userId = decoded.id
      next()
    }
  })
}

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId)
  const roles = await user.getRoles()
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name.toLowerCase() === 'admin') {
      next()
      return
    }
  }
  res.forbidden()
}

module.exports = { verifyToken, isAdmin }
