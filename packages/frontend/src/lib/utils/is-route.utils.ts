import { MainPaths } from '@Enums/paths/main-paths.enum';

export const isRoute = (path: string) =>
  path !== MainPaths.LOGIN &&
  path !== MainPaths.SIGNUP &&
  path !== MainPaths.FORGOT_USER_PASSWORD &&
  path !== MainPaths.FORGOT_USER_PASSWORD_CONFIRM;
