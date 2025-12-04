export const adaptResetPswtoResetPswRequest = (data: {token: string, password: string}) => {
  return {
    token: data.token,
    new_password: data.password
  }
}