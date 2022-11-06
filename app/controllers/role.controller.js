const RoleService = require('../services/role.service')

exports.all = async (req, res) => {
  res.json(await RoleService.all())
}
