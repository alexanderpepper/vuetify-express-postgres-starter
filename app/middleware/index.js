const authJwt = require('./authJwt')
const validateSignUp = require('./validateSignUp')
const verifyPasswordChange = require('./verifyPasswordChange')
module.exports = {
  jwt: authJwt,
  validateSignUp,
  verifyPasswordChange
}
