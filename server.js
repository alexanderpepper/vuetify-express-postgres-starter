const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const origin = 'http://localhost:8080'
const db = require('./app/models')
const seed = require('./app/middleware/seed')
const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin }))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/role.routes')(app)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

db.sequelize.sync({ force: true }).then(seed)
