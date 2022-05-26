import express from 'express';
import { createServer } from 'http';
import { existsSync, mkdirSync } from 'fs';
import cors from 'cors';
import { initializeApolloServer } from '@Shared/infrastructure/config/initialize-apollo-server';
import { v1Router } from '@Shared/infrastructure/http/api/v1';
import { checkEnv } from '@Shared/utils/checkEnv.utils';
import {
  FRONT_URL,
  APOLLO_STUDIO_URL,
  IMAGES_PATH,
} from '@Shared/utils/constants';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';

const origin = {
  origin: [FRONT_URL, APOLLO_STUDIO_URL],
  credentials: true,
};

export const initializeHttpServer = async () => {
  const app = express();
  checkEnv();

  app.use(cors(origin));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  /* Images dir */
  if (!existsSync(IMAGES_PATH)) {
    mkdirSync(IMAGES_PATH);
  }

  app.use(MainPaths.API, v1Router);

  const httpServer = createServer(app);

  await initializeApolloServer(app, httpServer);

  return { app, httpServer };
};
