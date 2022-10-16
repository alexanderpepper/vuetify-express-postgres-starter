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

exports.upload = async (binary) => {
  const params = {
    Bucket: credentials.bucketName,
    Key: uuid(),
    Body: Buffer.from(binary, 'binary')
  }
  try {
    return await new AWS.S3()
      .upload(params)
      .promise()
  } catch (error) {
    console.log(error)
    throw error
  }
}

exports.download = ({ key, res }) => {
  new AWS.S3()
    .getObject({ Bucket: credentials.bucketName, Key: key })
    .createReadStream()
    .pipe(res)
}
