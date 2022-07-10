const db = require('../models')
const Role = db.role

exports.all = (req, res) => Role.findAll({ raw: true }).then(res.json)
