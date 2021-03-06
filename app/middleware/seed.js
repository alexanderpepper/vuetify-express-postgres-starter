const db = require('../models')
const bcrypt = require('bcryptjs')
const Role = db.role
const User = db.user

const fakeUserData = {
  username: null,
  name: null,
  email: null,
  phone: '21088888888',
  birthday: '1998-08-18',
  password: bcrypt.hashSync('admin1234', 8),
  securityQuestion1: 'Q1',
  securityQuestion2: 'Q2',
  securityAnswer1: 'A1',
  securityAnswer2: 'A2'
}

module.exports = async () => {
  Role.create({
    id: 1,
    name: 'User'
  })
  Role.create({
    id: 2,
    name: 'Admin'
  })
  const testUser = await User.create({
    ...fakeUserData,
    username: 'test',
    name: 'test',
    email: 'test@test.com'
  })
  await testUser.setRoles([1])

  const adminUser = await User.create({
    ...fakeUserData,
    username: 'admin',
    name: 'admin',
    email: 'admin@admin.com'
  })
  await adminUser.setRoles([2])
}
