import supertest from 'supertest';
import mongoose from 'mongoose';
import { User } from '@Shared/infrastructure/http/mongodb/schemas/user.schema';
import { Recipe } from '@Shared/infrastructure/http/mongodb/schemas/recipe.schema';
import { Comment } from '@Shared/infrastructure/http/mongodb/schemas/comment.schema';
import { app } from '@Shared/infrastructure/http/app';

const api = supertest(app);

export { api, mongoose, User, Recipe, Comment };
