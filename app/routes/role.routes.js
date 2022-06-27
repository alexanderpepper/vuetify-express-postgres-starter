const { jwt } = require('../middleware')
const controller = require('../controllers/role.controller')

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
    next()
  })
  app.get('/api/roles', [jwt.verifyToken, jwt.isAdmin], controller.all)
}
