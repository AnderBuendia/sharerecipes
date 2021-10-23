export enum UserErrors {
  REGISTERED = 'User is already registered',
  USER_NOT_FOUND = 'User not found',
  EMAIL_NOT_FOUND = 'Email not found',
  EMAIL_FORMAT = 'Email format invalid',
  USERNAME_FORMAT = 'Username format invalid',
  NOT_ACTIVATED = 'Your account has not activated. Please check your email',
  PASSWORD = 'Password is wrong',
  CURRENT_PASSWORD = 'Your current password is wrong',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  LINK_EXPIRED = 'Link has expired. Try to send a new link',
}
