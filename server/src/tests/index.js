const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { app, server } = require('../index');
const api = supertest(app);

module.exports = { api, server, mongoose, User, Recipe, Comment };
