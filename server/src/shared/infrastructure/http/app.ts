import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import cors from 'cors';
import './paths';
import { connectDB } from '@Shared/infrastructure/http/mongodb/database';
import { startApolloServer } from '@Shared/infrastructure/http/graphql/apollo-server';
import { v1Router } from '@Shared/infrastructure/http/api/v1';
import { checkEnv } from '@Shared/utils/checkEnv.utils';
import {
  FRONT_URL,
  APOLLO_STUDIO_URL,
  IMAGES_PATH,
} from '@Shared/utils/constants';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';

/* CORS Rules */
const origin = {
  origin: [FRONT_URL, APOLLO_STUDIO_URL],
  credentials: true,
};

/* Create server */
export const app = express();
checkEnv();

/* Initialize Apollo server */
startApolloServer(app);

/* App use cors */
app.use(cors(origin));

/* Read JSON body values */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Connect DB */
connectDB();
console.log('🚀 Initializing Server...');

/* Images dir */
if (!existsSync(IMAGES_PATH)) {
  mkdirSync(IMAGES_PATH);
}

/* Routes */
app.use(MainPaths.API, v1Router);
