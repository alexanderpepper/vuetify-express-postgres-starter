const db = require('../models')
const moment = require('moment')
const User = db.user

exports.isValidPassword = password => {
  return password.length >= 8
}

exports.hasMatchingConfirmPassword = (user) => {
  return user.password === user.confirmPassword
}

exports.hasValidPhone = user => {
  return user.phone &&
    (user.isInternationalPhone || user.phone.length === 10)
}

exports.hasValidAddress = user => {
  return user.addressLine1 &&
    user.city &&
    user.country &&
    (user.country === 'United States' ? user.state && user.zipCode : true)
}

exports.hasValidBirthday = user => {
  return moment(user.birthday, 'YYYY-MM-DD').isValid()
}

exports.isValidEmail = input => {
  return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/.test(input)
}

exports.addSignUpGeneralValidationErrors = async (user, validationErrors) => {
  if (!user.username) {
    validationErrors.username = [
      ...(validationErrors.username || []),
      'Username is required.'
    ]
  } else {
    const found = await User.findOne({ where: { username: user.username } })
    if (found) {
      validationErrors.username = [
        ...(validationErrors.username || []),
        'Account already exists with this username.'
      ]
    }
  }

  if (!user.name) {
    validationErrors.name = [
      ...(validationErrors.name || []),
      'Name is required.'
    ]
  }

  if (!user.email) {
    validationErrors.email = [
      ...(validationErrors.email || []),
      'Email is required.'
    ]
  } else if (!this.isValidEmail(user.email)) {
    validationErrors.email = [
      ...(validationErrors.email || []),
      'Invalid email.'
    ]
  } else {
    const found = await User.findOne({ where: { email: user.email } })
    if (found) {
      validationErrors.email = [
        ...(validationErrors.email || []),
        'Account already exists with this email.'
      ]
    }
  }

  if (!user.birthday) {
    validationErrors.birthday = [
      ...(validationErrors.birthday || []),
      'Birthday is required.'
    ]
  } else if (!this.hasValidBirthday(user)) {
    validationErrors.birthday = [
      ...(validationErrors.birthday || []),
      'Birthday is not a valid date.'
    ]
  }

  if (!user.phone) {
    validationErrors.phone = [
      ...(validationErrors.phone || []),
      'Phone number is required.'
    ]
  } else if (!this.hasValidPhone(user)) {
    validationErrors.phone = [
      ...(validationErrors.phone || []),
      'U.S. phone numbers are required in 10-digit format.'
    ]
  }
}

exports.addSignUpPasswordValidationErrors = (user, validationErrors) => {
  if (!user.password) {
    validationErrors.password = [
      ...(validationErrors.password || []),
      'Password is required.'
    ]
  }

  if (!this.isValidPassword(user.password)) {
    validationErrors.password = [
      ...(validationErrors.password || []),
      'Passwords must be at least 8 characters.'
    ]
  }

  if (!user.confirmPassword) {
    validationErrors.confirmPassword = [
      ...(validationErrors.confirmPassword || []),
      'Confirmation password is required.'
    ]
  }

  if (!this.hasMatchingConfirmPassword(user)) {
    validationErrors.confirmPassword = [
      ...(validationErrors.confirmPassword || []),
      'Password and confirmation password must match.'
    ]
  }
}

exports.addSignUpSecurityQuestionValidationErrors = (user, validationErrors) => {
  if (!user.securityQuestion1) {
    validationErrors.securityQuestion1 = [
      ...(validationErrors.securityQuestion1 || []),
      'The first security question is required.'
    ]
  }

  if (!user.securityQuestion2) {
    validationErrors.securityQuestion2 = [
      ...(validationErrors.securityQuestion2 || []),
      'The second security question is required.'
    ]
  }

  if (!user.securityAnswer1) {
    validationErrors.securityAnswer1 = [
      ...(validationErrors.securityAnswer1 || []),
      'The answer to the first security question is required.'
    ]
  }

  if (!user.securityAnswer2) {
    validationErrors.securityAnswer2 = [
      ...(validationErrors.securityAnswer2 || []),
      'The answer to the second security question is required.'
    ]
  }
}
