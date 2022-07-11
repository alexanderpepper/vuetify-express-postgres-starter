const db = require('../models')
const Role = db.role

exports.all = async (req, res) => {
  const roles = await Role.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
  res.json(roles)
}
