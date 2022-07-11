const host = process.env.VUE_APP_API_URL

export default {
  signUp: `${host}/sign-up`,
  signIn: `${host}/sign-in`,
  activate: `${host}/app-user/activate`,
  sendActivationLink: `${host}/app-user/send-activation-link`,
  sendPasswordResetLink: `${host}/app-user/send-password-reset-link`,
  getSecurityQuestions: `${host}/app-user/get-security-questions`,
  verifySecurityQuestions: `${host}/app-user/verify-security-questions`,
  getSendOptions: `${host}/app-user/get-send-options`,
  sendUsername: `${host}/app-user/send-username`,
  resetPassword: `${host}/app-user/set-password`,
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
