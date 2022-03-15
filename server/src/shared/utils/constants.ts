import path from 'path';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';
require('dotenv').config({ path: `${process.cwd()}/.env.local` });

/* Urls */
export const FRONT_URL = process.env.HOST_FRONT;
export const BACK_URL = process.env.BACKEND_URL;
export const API_URL = `${process.env.BACKEND_URL}${MainPaths.API}`;
export const APOLLO_STUDIO_URL = 'https://studio.apollographql.com';
export const DB_URL_TEST = process.env.DB_URL_TEST;
export const DB_URL = process.env.DB_URL;

/* Directory routes */
export const IMAGES_PATH = path.join(process.cwd(), `${MainPaths.IMAGES}`);

/* Node */
export const NODE_ENV = process.env.NODE_ENV;

/* Secret codes */
export const TOKEN_CODE = process.env.SECRET_JWT_ACCESS;
export const EMAIL_CODE = process.env.SECRET_EMAIL;
export const FORGOT_USER_PASSWORD_CODE = process.env.SECRET_FORGOT;

/* Send mails */
export const USER_EMAIL = process.env.EMAILU;
export const USER_EMAIL_PASS = process.env.EMAILP;

/* Magic numbers */
export const PORT = parseInt(process.env.BACK_PORT) || 4000;
export const DEFAULT_NUMBER_OF_VOTES = 0;
export const DEFAULT_AVERAGE_VOTE = 0;

/* Loose strings */
export const TOKEN_EXPIRED_TIME = '12h';
