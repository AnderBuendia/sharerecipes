import supertest from 'supertest';
import mongoose from 'mongoose';
import { User } from '@Models/User';
import { Recipe } from '@Models/Recipe';
import { Comment } from '@Models/Comment';
import { app } from '../index';
const api = supertest(app);

export { api, mongoose, User, Recipe, Comment };
