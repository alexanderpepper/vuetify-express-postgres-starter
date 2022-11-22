const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const origin = 'http://localhost:8080'
const db = require('./app/models')
const seed = require('./app/middleware/seed')
const responders = require('./app/middleware/responders')
const errorHandler = require('./app/middleware/error-handler')
const PORT = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  app.use(cors({ origin }))
}
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept')
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(responders)

require('./app/routes/user.routes')(app)
require('./app/routes/role.routes')(app)
require('./app/routes/file.routes')(app)
require('./app/routes/support.routes')(app)

app.use(errorHandler(isProduction))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

db.sequelize.sync({ force: true }).then(seed)
