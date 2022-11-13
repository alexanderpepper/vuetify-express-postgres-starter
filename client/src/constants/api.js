const host = process.env.VUE_APP_API_URL

export default {
  signUp: `${host}/sign-up`,
  validateSignUpCredentials: `${host}/sign-up/validate/credentials`,
  validateSignUpPassword: `${host}/sign-up/validate/password`,
  validateSignUpSecurityQuestions: `${host}/sign-up/validate/security-questions`,
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
  lockUser: (id, isLocked) => `${host}/users/${id}/lock/${isLocked}`,
  password: `${host}/change-password`,
  roles: `${host}/roles`,
  me: `${host}/me`,
  account: `${host}/account`,
  uploadFile: `${host}/upload`,
  downloadFile: key => `${host}/download/${key}`,
  sendSupportMessage: `${host}/support/send-message`
}
