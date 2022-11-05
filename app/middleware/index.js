const authJwt = require('./authJwt')
const validateSignUp = require('./validateSignUp')
module.exports = {
  jwt: authJwt,
  validateSignUp
}
