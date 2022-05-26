import { User } from '@Shared/infrastructure/http/mongodb/schemas/user.schema';
import { Recipe } from '@Shared/infrastructure/http/mongodb/schemas/recipe.schema';
import { Comment } from '@Shared/infrastructure/http/mongodb/schemas/comment.schema';
import supertest from 'supertest';
import { connect, disconnect } from 'mongoose';
import { initializeHttpServer } from '@Shared/infrastructure/config/initialize-http';
import { DB_URL_TEST } from '@Shared/utils/constants';

let api: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  await connect(DB_URL_TEST);

  const { app } = await initializeHttpServer();

  api = supertest(app);
});

afterAll(async () => {
  await disconnect();
});

export { api, User, Recipe, Comment };
