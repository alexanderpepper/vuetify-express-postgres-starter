const { obscuredPhone, obscuredEmail } = require('../utilities/user.utilities')
const AuthService = require('../services/auth.service')
const UserService = require('../services/user.service')
const JwtService = require('../services/jwt.service')
const MAX_AUTHENTICATION_FAILURES = 5

exports.signUp = async (req, res) => {
  await AuthService.signUp(req.body)
  res.success(['Sign up successful!'])
}

exports.signIn = async (req, res) => {
  const user = await UserService.findByUsername(req.body.username)
  if (!user) {
    res.unauthorized(['Invalid username or password'])
  } else if (user.isLocked) {
    res.forbidden(['Account is locked, please contact support'])
  } else if (AuthService.validatePassword(req.body.password, user.password)) {
    if (user.isActivated) {
      user.authenticationFailures = 0
      await user.save()
      res.json({
        id: user.id,
        token: JwtService.getToken(user),
        expirationDate: JwtService.getExpirationDate()
      })
    } else {
      res.forbidden(['Account not yet activated'], {
        user: {
          obscuredEmail: obscuredEmail(user),
          obscuredPhone: obscuredPhone(user)
        }
      })
    }
  } else {
    const messages = ['Invalid username or password']
    user.authenticationFailures++
    if (user.authenticationFailures < MAX_AUTHENTICATION_FAILURES) {
      const remainingAttempts = MAX_AUTHENTICATION_FAILURES - user.authenticationFailures
      messages.push(`${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining`)
    } else if (user.authenticationFailures === MAX_AUTHENTICATION_FAILURES) {
      messages.push('Account is locked, please contact support')
      user.isLocked = true
    }
    await user.save()
    res.unauthorized(messages)
  }
}

exports.changePassword = async (req, res) => {
  const success = await AuthService.changePassword({
    id: req.userId,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.password
  })
  if (success) {
    res.success(['Password updated successfully'])
  } else {
    res.unauthorized(['Invalid password'])
  }
}

exports.getSecurityQuestions = async (req, res) => {
  const user = await AuthService.getSecurityQuestions(req.body)
  if (user) {
    res.json(user)
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.activate = async (req, res) => {
  const success = await AuthService.activate(req.body)
  if (success) {
    res.success(['User successfully activated.'])
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.sendActivationLink = async (req, res) => {
  const success = await AuthService.sendActivationLink(req.body)
  if (success) {
    res.success(['Activation link sent!'])
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.sendPasswordResetLink = async (req, res) => {
  const success = await AuthService.sendPasswordResetLink(req.body)
  if (success) {
    res.success([`Password reset link sent via ${req.body.sendViaSms ? 'text message' : 'email'}`])
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.verifySecurityQuestions = async (req, res) => {
  const user = await AuthService.verifySecurityQuestions(req.body)
  if (user) {
    res.json({
      obscuredEmail: obscuredEmail(user),
      obscuredPhone: obscuredPhone(user)
    })
  } else {
    res.badRequest(['One or more security questions answered incorrectly'])
  }
}

exports.getSendOptions = async (req, res) => {
  const user = await AuthService.getSendOptions(req.body)
  if (user) {
    res.json({ obscuredEmail: obscuredEmail(user) })
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.sendUsername = async (req, res) => {
  const success = await AuthService.sendUsername(req.body)
  if (success) {
    res.success([`Username sent via ${req.body.sendViaSms ? 'text message' : 'email'}`])
  } else {
    res.badRequest(['Account not found'])
  }
}

exports.resetPassword = async (req, res) => {
  const user = await AuthService.resetPassword(req.body)
  if (user) {
    if (user.isActivated) {
      res.json({
        id: user.id,
        token: JwtService.getToken(user),
        expirationDate: JwtService.getExpirationDate()
      })
    } else {
      res.forbidden(['User not activated'])
    }
  } else {
    res.badRequest(['Account not found'])
  }
}
