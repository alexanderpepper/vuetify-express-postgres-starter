const db = require('../models')
const Role = db.role

exports.all = async () => {
  return await Role.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
}
