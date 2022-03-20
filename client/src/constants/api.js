const host = process.env.VUE_APP_API_URL

export default {
  activate: `${host}/app-user/activate`,
  sendActivationLink: `${host}/app-user/send-activation-link`,
  sendPasswordResetLink: `${host}/app-user/send-password-reset-link`,
  getSecurityQuestions: `${host}/app-user/get-security-questions`,
  verifySecurityQuestions: `${host}/app-user/verify-security-questions`,
  getSendOptions: `${host}/app-user/get-send-options`,
  sendUsername: `${host}/app-user/send-username`,
  resetPassword: `${host}/app-user/set-password`,
  login: `${host}/app-user/login?include=user`,
  logout: `${host}/app-user/logout`,
  users: `${host}/app-user`,
  user: id => `${host}/app-user/${id}`,
  password: `${host}/app-user/change-password`,
  roles: `${host}/app-role`,
  me: `${host}/app-user/me`,
  profile: `${host}/app-user/profile`,
  roleMappings: `${host}/app-role-mapping`,
  roleMapping: id => `${host}/app-role-mapping/${id}`,
  userCount: `${host}/app-user/count`,
  uploadFile: `${host}/container/vuetify-express-postgresql-starter/upload`,
  uploadedFile: path => `${host}/container/vuetify-express-postgresql-starter/download/${path}`,
  sendSupportMessage: `${host}/support/send-message`
}
