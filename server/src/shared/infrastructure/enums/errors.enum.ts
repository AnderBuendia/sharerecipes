export enum CommonErrors {
  INVALID_CREDENTIALS = 'Invalid Credentials',
  TOKEN_NOT_FOUND = 'Token not found',
  FORMAT = 'does not comply with the established format',
}

export enum RecipeErrors {
  RECIPE_NOT_FOUND = 'Recipe not found',
  RECIPES_NOT_FOUND = 'Recipes not found',
  COMMENT_NOT_FOUND = 'Comment not found',
  RECIPE_VOTED = 'You has voted this recipe',
  COMMENT_VOTED = 'You has voted this comment',
  NO_MESSAGE = 'Please introduce your message',
}

export enum UserErrors {
  REGISTERED = 'User is already registered',
  USERS_NOT_FOUND = 'Users not found',
  USER_NOT_FOUND = 'User not found',
  EMAIL_NOT_FOUND = 'Email not found',
  USERNAME_FORMAT = 'Username format invalid',
  NOT_ACTIVATED = 'Your account has not activated. Please check your email',
  PASSWORD = 'Password is wrong',
  CURRENT_PASSWORD = 'Your current password is wrong',
  NOT_LOGGED_IN = 'You are not logged in. Please authenticate your account',
  LINK_EXPIRED = 'Link has expired. Try to send a new link',
}

export enum CommentErrors {
  COMMENTS_NOT_FOUND = 'Comments not found',
  COMMENT_NOT_FOUND = 'Comments not found',
  NO_MESSAGE = 'Please introduce your message',
}

export enum UploadErrors {
  FILE_NOT_FOUND = 'File not found',
}
