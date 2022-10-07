const { obscuredPhone, obscuredEmail } = require('../utilities/user.utilities')
const UserService = require('../services/user.service')
const JwtService = require('../services/jwt.service')

exports.signUp = async (req, res) => {
  await UserService.register(req.body)
  res.json({
    status: 200,
    messages: ['User was registered successfully!']
  })
}

exports.signIn = async (req, res) => {
  const user = UserService.findByIdentifier(req.body.identifier)
  if (user && UserService.validatePassword(req.body.password, user.password)) {
    if (user.isActivated) {
      res.json({
        id: user.id,
        token: JwtService.getToken(user),
        expirationDate: JwtService.getExpirationDate()
      })
    } else {
      res.status(403).send({
        status: 403,
        messages: ['Account not activated'],
        user: {
          obscuredEmail: obscuredEmail(user),
          obscuredPhone: obscuredPhone(user)
        }
      })
    }
  } else {
    res.status(401).send({
      status: 401,
      messages: ['Invalid username or password']
    })
  }
}

exports.changePassword = async (req, res) => {
  const success = await UserService.changePassword({
    id: req.userId,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword
  })
  if (success) {
    res.json({ messages: ['Password updated successfully'] })
  } else {
    res.status(401).send({
      status: 401,
      messages: ['Invalid password']
    })
  }
}

exports.getSecurityQuestions = async (req, res) => {
  const user = await UserService.getSecurityQuestions(req.body)
  if (user) {
    res.json(user)
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.activate = async (req, res) => {
  const success = await UserService.activate(req.body)
  if (success) {
    res.json({
      status: 200,
      messages: ['User successfully activated.']
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.sendActivationLink = async (req, res) => {
  const success = await UserService.sendActivationLink(req.body)
  if (success) {
    res.json({
      status: 200,
      messages: ['Activation link sent!']
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.sendPasswordResetLink = async (req, res) => {
  const success = UserService.sendPasswordResetLink(req.body)
  if (success) {
    res.json({
      status: 200,
      messages: [`Password reset link sent via ${req.body.sendViaSms ? 'SMS' : 'email'}`]
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.verifySecurityQuestions = async (req, res) => {
  const user = UserService.verifySecurityQuestions(req.body)
  if (user) {
    res.json({
      obscuredEmail: obscuredEmail(user),
      obscuredPhone: obscuredPhone(user)
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.getSendOptions = async (req, res) => {
  const user = UserService.getSendOptions(req.body)
  if (user) {
    res.json({ obscuredEmail: obscuredEmail(user) })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.sendUsername = async (req, res) => {
  const success = UserService.sendUsername(req.body)
  if (success) {
    res.json({
      status: 200,
      messages: [`Username sent via ${req.body.sendViaSms ? 'SMS' : 'email'}`]
    })
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}

exports.resetPassword = async (req, res) => {
  const user = UserService.resetPassword(req.body)
  if (user) {
    if (user.isActivated) {
      res.json({
        id: user.id,
        token: JwtService.getToken(user),
        expirationDate: JwtService.getExpirationDate()
      })
    } else {
      res.status(403).send({
        status: 403,
        messages: ['User not activated']
      })
    }
  } else {
    res.status(400).send({
      status: 400,
      messages: ['Account not found']
    })
  }
}
