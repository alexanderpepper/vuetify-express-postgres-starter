const host = process.env.VUE_APP_API_URL

export default {
  signUp: `${host}/sign-up`,
  signIn: `${host}/sign-in`,
  activate: `${host}/activate`,
  sendActivationLink: `${host}/send-activation-link`,
  sendPasswordResetLink: `${host}/send-password-reset-link`,
  getSecurityQuestions: `${host}/get-security-questions`,
  verifySecurityQuestions: `${host}/verify-security-questions`,
  getSendOptions: `${host}/get-send-options`,
  sendUsername: `${host}/send-username`,
  setPassword: `${host}/set-password`,
  users: `${host}/users`,
  user: id => `${host}/users/${id}`,
  password: `${host}/change-password`,
  roles: `${host}/roles`,
  me: `${host}/me`,
  account: `${host}/account`,
  uploadFile: `${host}/container/vuetify-express-postgresql-starter/upload`,
  uploadedFile: path => `${host}/container/vuetify-express-postgresql-starter/download/${path}`,
  sendSupportMessage: `${host}/support/send-message`
}
