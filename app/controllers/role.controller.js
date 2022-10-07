const RoleService = require('../services/role.service')

exports.all = async (req, res) => {
  res.json(RoleService.all())
}
