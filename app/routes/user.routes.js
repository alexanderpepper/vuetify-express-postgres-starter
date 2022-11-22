const jwt = require('../middleware/jwt')
const validator = require('../middleware/validator')
const controller = require('../controllers/user.controller')
const genericController = require('../controllers/generic.controller')

module.exports = app => {
  // unauthenticated routes
  app.post('/api/users/sign-up', [validator.validateSignUp], controller.signUp)
  app.post('/api/users/sign-up/validate/credentials', [validator.validateSignUpCredentials], genericController.validationSuccessResponse)
  app.post('/api/users/sign-up/validate/password', [validator.validateSignUpPassword], genericController.validationSuccessResponse)
  app.post('/api/users/sign-up/validate/security-questions', [validator.validateSignUpSecurityQuestions], genericController.validationSuccessResponse)
  app.post('/api/users/sign-in', [validator.validateSignIn], controller.signIn)
  app.post('/api/users/get-security-questions', [validator.validateGetSecurityQuestions], controller.getSecurityQuestions)
  app.post('/api/users/activate', [validator.validateActivation], controller.activate)
  app.post('/api/users/send-activation-link', [validator.validateSendActivationLink], controller.sendActivationLink)
  app.post('/api/users/send-password-reset-link', [validator.validateSendPasswordResetLink], controller.sendPasswordResetLink)
  app.post('/api/users/verify-security-questions', [validator.validateSignUpSecurityQuestions], controller.verifySecurityQuestions)
  app.post('/api/users/get-send-options', [validator.validateGetSendOptions], controller.getSendOptions)
  app.post('/api/users/send-username', [validator.validateSendUsername], controller.sendUsername)
  app.post('/api/users/set-password', [validator.validateSetPassword], controller.resetPassword)

  // authenticated routes
  app.get('/api/users/me', [jwt.verifyToken], controller.me)
  app.get('/api/users/account', [jwt.verifyToken], controller.account)
  app.put('/api/users/account', [jwt.verifyToken, validator.validateAccountUpdate], controller.updateAccount)
  app.post('/api/users/change-password', [jwt.verifyToken, validator.validatePasswordChange], controller.changePassword)

  // admin routes
  app.get('/api/users', [jwt.verifyToken, jwt.isAdmin], controller.all)
  app.get('/api/users/:id', [jwt.verifyToken, jwt.isAdmin], controller.get)
  app.delete('/api/users/:id', [jwt.verifyToken, jwt.isAdmin], controller.delete)
  app.post('/api/users', [jwt.verifyToken, jwt.isAdmin, validator.validateSignUp], controller.create)
  app.put('/api/users/:id', [jwt.verifyToken, jwt.isAdmin, validator.validateAccountUpdate], controller.update)
  app.post('/api/users/:id/lock/:isLocked', [jwt.verifyToken, jwt.isAdmin], controller.lock)
}
