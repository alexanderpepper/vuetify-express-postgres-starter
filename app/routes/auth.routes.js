const { verifySignUp, verifyPasswordChange, jwt } = require('../middleware')
const controller = require('../controllers/auth.controller')

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
    next()
  })
  app.post('/api/sign-up', [verifySignUp.checkDuplicateUsernameOrEmail], controller.signUp)
  app.post('/api/change-password', [jwt.verifyToken, verifyPasswordChange.checkPasswordChange], controller.changePassword)
  app.post('/api/sign-in', controller.signIn)
  app.post('/api/get-security-questions', controller.getSecurityQuestions)
  app.post('/api/activate', controller.activate)
  app.post('/api/send-activation-link', controller.sendActivationLink)
  app.post('/api/send-password-reset-link', controller.sendPasswordResetLink)
  app.post('/api/verify-security-questions', controller.verifySecurityQuestions)
  app.post('/api/get-send-options', controller.getSendOptions)
  app.post('/api/send-username', controller.sendUsername)
  app.post('/api/set-password', controller.resetPassword)
}
