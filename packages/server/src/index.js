const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const cors = require('cors');
require('./db/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'src/variables.env' });
const Env = require('./enums/env.enums');
const typeDefs = require('./graphql/mainTypeDefs');
const resolvers = require('./graphql/mainResolvers');

/**
 * Checks if all environment variables are available in proccess.env before boot
 */
function checkEnv() {
  Object.keys(Env).forEach((keyEnv) => {
    if (!process.env[keyEnv])
      throw new Error(
        `${keyEnv} missing, check the .env.example file and verify that the .env file contains the same variables`
      );
  });
}

/* Create server */
const app = express();
checkEnv();

/* Apollo server */
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const authorization = req.headers['authorization'];

    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    req.url = url;

    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.SECRET_JWT_ACCESS);
        req.user = payload;
      } catch (err) {}

      return { req, res };
    }

    return { req, res };
  },
});

/* Db Setup */
console.log('Initializing Server...');

/* App use cors */
app.use(
  cors({
    origin: process.env.HOST_FRONT,
    credentials: true,
  })
);

/* Read JSON body values */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Images dir */
existsSync(path.join(__dirname, '/images')) ||
  mkdirSync(path.join(__dirname, '/images'));
app.use('/images', express.static(path.join(__dirname, '/images')));

app.get('/health', (ctxt, res) => {
  ctxt.body = 'ok';
  res.send('Hello World!');
});

/* Route to upload images with multer */
app.use('/upload', require('./routes/uploads'));

apolloServer.applyMiddleware({ app, cors: false });

/* App port */
const port = parseInt(process.env.BACK_PORT) || 4000;

/* App setup */
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}${apolloServer.graphqlPath}`);
});

module.exports = { app, server };
