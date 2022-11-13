const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const origin = 'http://localhost:8080'
const db = require('./app/models')
const seed = require('./app/middleware/seed')
const PORT = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  app.use(cors({ origin }))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

app.use((req, res, next) => {
  const responder = (status, defaultMessages) =>
    (messages, data) =>
      res.status(status).send({
        ...data,
        status,
        messages: messages || defaultMessages
      })

  res.success = responder(200, ['Success'])
  res.badRequest = responder(400, ['Bad Request'])
  res.unauthorized = responder(401, ['Unauthorized'])
  res.forbidden = responder(403, ['Forbidden'])
  res.serverError = responder(500, ['Something broke'])

  next()
})
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/role.routes')(app)
require('./app/routes/file.routes')(app)

app.use((error, req, res, next) => {
  if (!isProduction) {
    console.log(error.stack)
  }
  res.serverError()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

db.sequelize.sync({ force: true }).then(seed)
