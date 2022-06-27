const db = require('../models')
const config = require('../config/auth.config')
const Role = db.role

exports.all = (req, res) => Role.findAll({ raw: true }).then(res.json)
