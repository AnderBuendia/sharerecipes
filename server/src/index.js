const express = require('express');
const { ApolloServer, ApolloError } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const cors = require('cors');
require('./db/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'src/variables.env' });
const typeDefs = require('./graphql/mainTypeDefs');
const resolvers = require('./graphql/mainResolvers');
const UserErrors = require('./enums/user.errors');
const HTTPStatusCodes = require('./enums/http-status-code');
const { checkEnv } = require('./utils/checkEnv.utils');

const port = parseInt(process.env.BACK_PORT) || 4000;
const pathImages = path.join(__dirname, '/images');

/* Create server */
const app = express();
checkEnv();

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

/* Db Setup */
console.log('Initializing Server...');

/* Apollo server */
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const authorization = req.headers['authorization'];

    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    req.url = url;

    if (authorization) {
      const token = authorization.split(' ')[1];
      const payload = jwt.verify(
        token,
        process.env.SECRET_JWT_ACCESS,
        function (err, decoded) {
          if (err) {
            return new ApolloError(
              UserErrors.LINK_EXPIRED,
              HTTPStatusCodes.NOT_AUTHORIZED
            );
          }

          return decoded;
        }
      );

      req['user'] = payload;

      return { req, res };
    }

    return { req, res };
  },
});

/* Images dir */
existsSync(pathImages) || mkdirSync(pathImages);
app.use('/images', express.static(pathImages));

/* Route to upload images with multer */
app.use('/upload', require('./routes/uploads'));

apolloServer.applyMiddleware({ app, cors: false });

/* App setup */
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}${apolloServer.graphqlPath}`);
});

module.exports = { app, server };
