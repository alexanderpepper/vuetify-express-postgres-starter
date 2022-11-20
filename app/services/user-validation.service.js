const db = require('../models')
const moment = require('moment')
const User = db.user
const AuthService = require('../services/auth.service')
const MINIMUM_AGE = 13

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

exports.isOldEnough = user => {
  return moment().diff(moment(user.birthday, 'YYYY-MM-DD'), 'years', false) >= MINIMUM_AGE
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
    if (found && found.id !== user.id) {
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
    if (found && found.id !== user.id) {
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
  } else if (!this.isOldEnough(user)) {
    validationErrors.birthday = [
      ...(validationErrors.birthday || []),
      `Must be at least ${MINIMUM_AGE} years old.`
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
  } else {
    const found = await User.findOne({ where: { phone: user.phone } })
    if (found && found.id !== user.id) {
      validationErrors.phone = [
        ...(validationErrors.phone || []),
        'Account already exists with this phone.'
      ]
    }
  }
}

exports.addSignInValidationErrors = (user, validationErrors) => {
  if (!user.username) {
    validationErrors.username = [
      ...(validationErrors.username || []),
      'Username is required.'
    ]
  }
  if (!user.password) {
    validationErrors.password = [
      ...(validationErrors.password || []),
      'Password is required.'
    ]
  }
}

exports.addChangePasswordValidationErrors = async (user, validationErrors) => {
  module.exports.addSignUpPasswordValidationErrors(user, validationErrors)

  if (!user.oldPassword) {
    validationErrors.oldPassword = [
      ...(validationErrors.oldPassword || []),
      'Old password is required.'
    ]
  } else {
    const found = await AuthService.checkPassword({ id: user.id, password: user.oldPassword })
    if (!found) {
      validationErrors.oldPassword = [
        ...(validationErrors.oldPassword || []),
        'Old password is incorrect.'
      ]
    }
  }
}

exports.addSignUpPasswordValidationErrors = (user, validationErrors) => {
  if (!user.password) {
    validationErrors.password = [
      ...(validationErrors.password || []),
      'Password is required.'
    ]
  } else if (!this.isValidPassword(user.password)) {
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

exports.addGetSendOptionsValidationErrors = (user, validationErrors) => {
  if (!user.phone) {
    validationErrors.phone = [
      ...(validationErrors.phone || []),
      'Phone number is required.'
    ]
  }
  if (!user.birthday) {
    validationErrors.birthday = [
      ...(validationErrors.birthday || []),
      'Birthday is required.'
    ]
  }
}

exports.addGetSecurityQuestionsValidationErrors = (user, validationErrors) => {
  if (!user.username) {
    validationErrors.username = [
      ...(validationErrors.username || []),
      'Username is required.'
    ]
  }
  if (!user.birthday) {
    validationErrors.birthday = [
      ...(validationErrors.birthday || []),
      'Birthday is required.'
    ]
  }
}

exports.addActivationValidationErrors = (user, validationErrors) => {
  if (!user.activationCode) {
    validationErrors.activationCode = [
      ...(validationErrors.activationCode || []),
      'Activation code is required.'
    ]
  }
}

exports.addSendActivationLinkValidationErrors = (user, validationErrors) => {
  if (!user.username) {
    validationErrors.username = [
      ...(validationErrors.username || []),
      'Username is required.'
    ]
  }
}

exports.addSendPasswordResetLinkValidationErrors = (user, validationErrors) => {
  module.exports.addSignUpSecurityQuestionValidationErrors(user, validationErrors)
  if (!user.username) {
    validationErrors.username = [
      ...(validationErrors.username || []),
      'Username is required.'
    ]
  }
}

exports.addSendUsernameValidationErrors = (user, validationErrors) => {
  if (!user.phone) {
    validationErrors.phone = [
      ...(validationErrors.phone || []),
      'Phone number is required.'
    ]
  }
  if (!user.birthday) {
    validationErrors.birthday = [
      ...(validationErrors.birthday || []),
      'Birthday is required.'
    ]
  }
}

exports.addSetPasswordValidationErrors = (user, validationErrors) => {
  if (!user.username) {
    validationErrors.username = [
      ...(validationErrors.username || []),
      'Username is required.'
    ]
  }
  if (!user.password) {
    validationErrors.password = [
      ...(validationErrors.password || []),
      'Password is required.'
    ]
  }
  if (!user.passwordResetCode) {
    validationErrors.passwordResetCode = [
      ...(validationErrors.passwordResetCode || []),
      'Password reset code is required.'
    ]
  }
}
