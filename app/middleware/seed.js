const db = require('../models')
const bcrypt = require('bcryptjs')
const Role = db.role
const User = db.user

module.exports = () => {
  Role.create({
    id: 1,
    name: 'User'
  })
  Role.create({
    id: 2,
    name: 'Admin'
  })
  User.create({
    id: 1,
    username: 'test',
    name: 'test',
    password: bcrypt.hashSync('admin1234', 8)
  }).then(user => {
    user.setRoles([1])
  })
}
