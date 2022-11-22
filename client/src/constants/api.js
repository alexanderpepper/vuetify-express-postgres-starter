const host = process.env.VUE_APP_API_URL

export default {
  signUp: `${host}/users/sign-up`,
  validateSignUpCredentials: `${host}/users/sign-up/validate/credentials`,
  validateSignUpPassword: `${host}/users/sign-up/validate/password`,
  validateSignUpSecurityQuestions: `${host}/users/sign-up/validate/security-questions`,
  signIn: `${host}/users/sign-in`,
  activate: `${host}/users/activate`,
  sendActivationLink: `${host}/users/send-activation-link`,
  sendPasswordResetLink: `${host}/users/send-password-reset-link`,
  getSecurityQuestions: `${host}/users/get-security-questions`,
  verifySecurityQuestions: `${host}/users/verify-security-questions`,
  getSendOptions: `${host}/users/get-send-options`,
  sendUsername: `${host}/users/send-username`,
  setPassword: `${host}/users/set-password`,
  users: `${host}/users`,
  user: id => `${host}/users/${id}`,
  lockUser: (id, isLocked) => `${host}/users/${id}/lock/${isLocked}`,
  password: `${host}/users/change-password`,
  roles: `${host}/roles`,
  me: `${host}/users/me`,
  account: `${host}/users/account`,
  uploadFile: `${host}/files/upload`,
  downloadFile: key => `${host}/files/download/${key}`,
  sendSupportMessage: `${host}/support`
}
