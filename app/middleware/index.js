const authJwt = require('./authJwt')
const verifySignUp = require('./validateSignUp')
const verifyPasswordChange = require('./verifyPasswordChange')
module.exports = {
  jwt: authJwt,
  verifySignUp,
  verifyPasswordChange
}
