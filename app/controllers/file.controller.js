const FileService = require('../services/file.service')

exports.upload = async (req, res) => {
  res.json(await FileService.upload(req.files.file.data))
}

exports.download = async (req, res) => {
  const { key } = req.params
  FileService.download({ key, res })
}
