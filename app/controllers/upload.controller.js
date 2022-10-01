const { v4: uuid } = require('uuid')
const AWS = require('aws-sdk')
const credentials = require('../config/aws.config')

if (credentials.accessKeyId) {
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey
  })
}

exports.upload = async (req, res) => {
  const s3 = new AWS.S3()

  // Binary data base64
  const fileContent = Buffer.from(req.files.file.data, 'binary')

  // Setting up S3 upload parameters
  const params = {
    Bucket: credentials.bucketName,
    Key: uuid(), // File name you want to save as in S3
    Body: fileContent
  }

  // Uploading files to the bucket
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err)
      throw err
    }
    res.json(data)
  })
}

exports.download = async (req, res) => {
  const s3 = new AWS.S3()
  const params = {
    Bucket: credentials.bucketName,
    Key: req.params.key
  }
  s3.getObject(params)
    .createReadStream()
    .pipe(res)
}
