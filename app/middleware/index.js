const authJwt = require('./authJwt')
const verifySignUp = require('./verifySignUp')
const verifyPasswordChange = require('./verifyPasswordChange')
module.exports = {
  jwt: authJwt,
  verifySignUp,
  verifyPasswordChange
}
