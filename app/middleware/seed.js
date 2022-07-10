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
    username: 'test',
    name: 'test',
    email: 'test@test.com',
    phone: '21088888888',
    birthday: '2010-08-18',
    password: bcrypt.hashSync('admin1234', 8),
    securityQuestion1: 'Q1',
    securityQuestion2: 'Q2',
    securityAnswer1: 'A1',
    securityAnswer2: 'A2'
  }).then(user => {
    user.setRoles([1])
  })
}
