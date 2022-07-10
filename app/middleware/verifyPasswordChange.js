const db = require('../models')
const User = db.user
const checkPasswordChange = async (req, res, next) => {
  next()
}
module.exports = { checkPasswordChange }
