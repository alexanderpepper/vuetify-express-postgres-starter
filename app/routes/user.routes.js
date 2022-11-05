const { jwt, validateSignUp } = require('../middleware')
const controller = require('../controllers/user.controller')

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
    next()
  })
  app.get('/api/me', [jwt.verifyToken], controller.me)
  app.get('/api/account', [jwt.verifyToken], controller.account)
  app.put('/api/account', [jwt.verifyToken, validateSignUp.validateAccountUpdate], controller.updateAccount)
  app.get('/api/users', [jwt.verifyToken, jwt.isAdmin], controller.all)
  app.post('/api/users', [jwt.verifyToken, jwt.isAdmin], controller.create)
  app.get('/api/users/:id', [jwt.verifyToken, jwt.isAdmin], controller.get)
  app.put('/api/users/:id', [jwt.verifyToken, jwt.isAdmin], controller.update)
}
