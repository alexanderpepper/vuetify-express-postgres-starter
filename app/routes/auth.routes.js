const { verifySignUp, jwt } = require('../middleware')
const controller = require('../controllers/auth.controller')

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
    next()
  })
  app.get('/api/me', [jwt.verifyToken], controller.me)
  app.post('/api/sign-up', [verifySignUp.checkDuplicateUsernameOrEmail], controller.signUp)
  app.post('/api/sign-in', controller.signIn)
}
