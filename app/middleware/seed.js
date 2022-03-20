const db = require('../models')
const Role = db.role
const User = db.user

module.exports = () => {
  Role.create({
    name: 'User'
  })
  Role.create({
    name: 'Admin'
  })
}
