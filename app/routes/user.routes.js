const { jwt } = require('../middleware')
const controller = require('../controllers/user.controller')

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
    next()
  })
  app.get('/api/users/me', [jwt.verifyToken], controller.me)
  app.get('/api/users/profile', [jwt.verifyToken], controller.profile)
  app.put('/api/users', [jwt.verifyToken], controller.update)
}
