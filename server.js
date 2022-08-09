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

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/role.routes')(app)
require('./app/routes/upload.routes')(app)

app.use((err, req, res, next) => {
  if (!isProduction) {
    console.err(err.stack)
  }
  res.status(500).send({
    status: 500,
    messages: ['Something broke!']
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

db.sequelize.sync({ force: true }).then(seed)
