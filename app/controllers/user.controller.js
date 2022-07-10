const db = require('../models')
const { withoutKeys } = require('../utilities/object.utilities')
const User = db.user
const Role = db.role
const PROFILE_ATTRIBUTES = { exclude: ['password', 'passwordResetCode', 'activationCode'] }
const ME_ATTRIBUTES = ['id', 'name']

const roleRelationship = {
  model: Role,
  as: 'roles',
  attributes: ['id', 'name'],
  through: { attributes: [] }
}

exports.me = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ME_ATTRIBUTES,
      where: { id: req.userId },
      include: [roleRelationship]
    })
    res.json(user.get({ plain: true }))
  } catch (err) {
    res.json(500).send({ message: 'Internal server error' })
  }
}

exports.profile = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: PROFILE_ATTRIBUTES,
      where: { id: req.userId },
      include: [roleRelationship]
    })
    res.json(user.get({ plain: true }))
  } catch (err) {
    res.json(500).send({ message: 'Internal server error' })
  }
}

exports.update = async (req, res) => {
  try {
    if (req.userId !== req.body.id) {
      res.status(403).send({ message: 'Unauthorized' })
    }
    const data = withoutKeys(req.body, ['activationCode', 'passwordResetCode', 'id', 'password'])
    await User.update(data, { where: { id: req.body.id } })
    this.profile(req, res)
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
}
