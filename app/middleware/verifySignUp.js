const db = require('../models')
const User = db.user
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  let user = await User.findOne({ where: { username: req.body.username } })
  if (user) {
    res.status(400).send({
      status: 400,
      messages: ['Someone\'s already using that username.']
    })
    return
  }
  // Email
  user = await User.findOne({ where: { email: req.body.email } })
  if (user) {
    res.status(400).send({
      status: 400,
      messages: ['There\'s already an account with that email.']
    })
    return
  }
  next()
}
module.exports = { checkDuplicateUsernameOrEmail }
