import express from 'express';
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { connectDB } from '@DB/database';
import routes from '@Routes/index';
import typeDefs from '@Graphql/mainTypeDefs';
import resolvers from '@Graphql/mainResolvers';
import { UserErrors } from '@Enums/user-errors.enum';
import { HTTPStatusCodes } from '@Enums/http-status-code.enum';
import { checkEnv } from '@Utils/checkEnv.utils';
require('dotenv').config({ path: 'src/variables.env' });

const port = parseInt(process.env.BACK_PORT) || 4000;
const pathImages = path.join(process.cwd(), '/images');

/* Create server */
export const app = express();
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

/* Connect DB */
connectDB();
console.log('Initializing Server...');

/* Apollo server */
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const authorization = req.headers['authorization'];
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

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

/* Routes */
app.use(routes);

apolloServer.applyMiddleware({ app, cors: false });

/* App setup */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}${apolloServer.graphqlPath}`);
  });
}
