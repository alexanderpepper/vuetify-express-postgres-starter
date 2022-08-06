const db = require('../models')
const bcrypt = require('bcryptjs')
const Role = db.role
const User = db.user

const fakeUserData = {
  username: null,
  name: null,
  email: null,
  phone: null,
  birthday: null,
  password: bcrypt.hashSync('admin1234', 8),
  securityQuestion1: 'Q1',
  securityQuestion2: 'Q2',
  securityAnswer1: 'A1',
  securityAnswer2: 'A2',
  country: 'United States',
  state: 'Texas',
  city: 'San Antonio',
  zipCode: '78249',
  addressLine1: '123 Sesame St',
  addressLine2: '#987',
  isActivated: true
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
    email: 'test@test.com',
    phone: '7777777777',
    birthday: '1982-07-19'
  })
  await testUser.setRoles([1])

  const adminUser = await User.create({
    ...fakeUserData,
    username: 'admin',
    name: 'admin',
    email: 'admin@admin.com',
    phone: '8888888888',
    birthday: '2008-08-08'
  })
  await adminUser.setRoles([2])
}
