const controller = require('../controllers/file.controller')

module.exports = app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
    next()
  })
  app.post('/api/upload', controller.upload)
  app.get('/api/download/:key', controller.download)
}
