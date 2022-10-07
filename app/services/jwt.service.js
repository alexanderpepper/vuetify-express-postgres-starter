const config = require('../config/auth.config')
const jwt = require('jsonwebtoken')

const TOKEN_VALIDITY_PERIOD = 86400

exports.getToken = ({ id }) => {
  return jwt.sign({ id }, config.secret, { expiresIn: TOKEN_VALIDITY_PERIOD })
}

exports.getExpirationDate = () => {
  return new Date().getTime() + TOKEN_VALIDITY_PERIOD
}
