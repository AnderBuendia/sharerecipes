const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'src/variables.env'});
const typeDefs = require('./graphql/mainTypeDefs');
const resolvers = require('./graphql/mainResolvers');

/* Apollo server */
const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req, res}) => {
            const authorization = req.headers['authorization'];
            
            const url = req.protocol + '://' + req.get('host') + req.originalUrl;
            req.url = url;

            if (authorization) {
                try {
                    const token = authorization.split(' ')[1];
                    const payload = jwt.verify(token, process.env.SECRET_JWT_ACCESS);
                    req.user = payload;
                } catch (err) {
                }

                return { req, res }
            }

            return { req, res }
        }
    });

    /* Db Setup */
    connectDB();
    console.log('Initializing Server...');

    /* Create server */
    const app = express();

    /* App use cors */
    app.use(cors({
        origin: process.env.HOST_FRONT,
        credentials: true
    }));

    /* Read JSON body values */
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    
    /* Images dir */
    existsSync(path.join(__dirname, '/images')) || mkdirSync(path.join(__dirname, "/images"));
    app.use("/images", express.static(path.join(__dirname, "/images")));
    
    /* Route to upload images with multer */
    app.use('/upload', require('./routes/uploads'));

    server.applyMiddleware({ app, cors: false });

    /* App port */
    const port = process.env.BACK_PORT || 4000;

    /* App setup */
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}${server.graphqlPath}`);
    });
};

startServer();