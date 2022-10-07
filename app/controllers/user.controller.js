const UserService = require('../services/user.service')

exports.me = async (req, res) => {
  res.json(await UserService.me({ id: req.userId }))
}

exports.account = async (req, res) => {
  res.json(await UserService.account({ id: req.userId }))
}

exports.updateAccount = async (req, res) => {
  if (req.userId !== req.body.id) {
    res.status(403).send({
      status: 403,
      messages: ['Unauthorized']
    })
  } else {
    const id = await UserService.updateAccount(req.body)
    res.json({ id })
  }
}

exports.all = async (req, res) => {
  res.json(await UserService.all())
}

exports.get = async (req, res) => {
  res.json(await UserService.get({ id: req.params.id }))
}

exports.create = async (req, res) => {
  res.json(await UserService.create(req.body))
}

exports.update = async (req, res) => {
  const user = await UserService.update(req.body)
  res.json({ id: user.id })
}

exports.delete = async (req, res) => {
  await UserService.delete({ id: req.params.id })
  res.json('Deleted successfully')
}
