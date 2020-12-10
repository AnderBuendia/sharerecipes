const express = require('express');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'src/config/variables.env'});
const typeDefs = require('./graphql/mainTypeDefs');
const resolvers = require('./graphql/mainResolvers');

/* Apollo server */
const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req, res}) => ({req, res})
    });

    /* Db Setup */
    connectDB();
    console.log('Initializing Server...');

    /* Create server */
    const app = express();

    /* Read JSON body values */
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /* App use cors */
    app.use(cors());

    /* App session */
    app.use(session({
        secret: process.env.SESSION_KEY || 'somesupersecret',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false, maxAge: 1000*60*4}
    }));

    /* Images dir */
    existsSync(path.join(__dirname, '../images')) || mkdirSync(path.join(__dirname, "../images"));
    app.use("/images", express.static(path.join(__dirname, "../images")));
    existsSync(path.join(__dirname, '../images/recipe')) || mkdirSync(path.join(__dirname, "../images/recipe"));
    app.use("/images/recipe", express.static(path.join(__dirname, "../images/user")));
    existsSync(path.join(__dirname, '../images/user')) || mkdirSync(path.join(__dirname, "../images/user"));
    app.use("/images/user", express.static(path.join(__dirname, "../images/user")));

    /* Setup JWT authentication middleware */
    app.use((req, _, next) => {
        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_JWT);
                req.user = user;
            } catch {
                return next();
            }
        }
        next();
    });

    server.applyMiddleware({ app });

    /* App port */
    const port = process.env.PORT || 4000;

    /* App setup */
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}${server.graphqlPath}`);
    });
};

startServer();