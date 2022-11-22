const controller = require('../controllers/support.controller')
const validator = require('../middleware/validator')

module.exports = app => {
  app.post('/api/support', [validator.validateSendSupportMessage], controller.sendSupportMessage)
}
