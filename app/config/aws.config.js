module.exports = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bucketName: process.env.AWS_BUCKET_NAME || 'vuetify-express-postgresql-starter',
  supportEmail: process.env.SUPPORT_EMAIL || 'support@vuetify-express-postgresql-starter.com',
  noReplyEmail: process.env.NO_REPLY_EMAIL || 'no-reply@vuetify-express-postgresql-starter.com'
}
