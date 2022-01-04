import { MainPaths } from '@Enums/paths/main-paths.enum';

export const isRoute = (path: string) =>
  path !== MainPaths.LOGIN &&
  path !== MainPaths.SIGNUP &&
  path !== MainPaths.FORGOT_PASSWORD &&
  path !== MainPaths.FORGOT_PASSWORD_CONFIRM;
