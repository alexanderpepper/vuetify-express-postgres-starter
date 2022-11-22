const controller = require('../controllers/file.controller')

module.exports = app => {
  app.post('/api/files/upload', controller.upload)
  app.get('/api/files/download/:key', controller.download)
}
