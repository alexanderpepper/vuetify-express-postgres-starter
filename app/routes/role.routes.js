const jwt = require('../middleware/jwt')
const controller = require('../controllers/role.controller')

module.exports = app => {
  app.get('/api/roles', [jwt.verifyToken, jwt.isAdmin], controller.all)
}
