const User = require('./models/User');

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db/database');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'src/config/variables.env'});
const typeDefs = require('./graphql/mainTypeDefs');
const resolvers = require('./graphql/mainResolvers');
const { createAccessToken, createRefreshToken } = require("./utils/auth");
const sendRefreshToken = require('./utils/sendRefreshToken');

/* Apollo server */
const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req, res}) => {
            const authorization = req.headers['authorization'];

            if(authorization) {
                try {
                    const token = authorization.split(' ')[1];
                    const payload = jwt.verify(token, process.env.SECRET_JWT_ACCESS);
                    req.user = payload;
                } catch (err) {
                    console.log(err);
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

    /* Read JSON body values */
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /* App use cors */
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    }));

    app.use(cookieParser());

    /* Images dir */
    existsSync(path.join(__dirname, '../images')) || mkdirSync(path.join(__dirname, "../images"));
    app.use("/images", express.static(path.join(__dirname, "../images")));
    existsSync(path.join(__dirname, '../images/recipe')) || mkdirSync(path.join(__dirname, "../images/recipe"));
    app.use("/images/recipe", express.static(path.join(__dirname, "../images/user")));
    existsSync(path.join(__dirname, '../images/user')) || mkdirSync(path.join(__dirname, "../images/user"));
    app.use("/images/user", express.static(path.join(__dirname, "../images/user")));

    /* Refresh Token */
    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid;

        if (!token) {
            return res.send({ ok: false, accessToken: '' });
        }

        let payload = null;

        try {
            payload = jwt.verify(token, process.env.SECRET_JWT_REFRESH);
        } catch (err) {
            console.log(err)
            return res.send({ ok: false, accessToken: '' });
        }

        /* Token is valid and we can send back an access token */
        const user = await User.findOne({ _id: payload.id });

        if (!user) {
            return res.send({ ok: false, accessToken: '' }); 
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: "" });
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.send({ ok: true, accessToken: createAccessToken(user) })
    });

    server.applyMiddleware({ app, cors: false });

    /* App port */
    const port = process.env.PORT || 4000;

    /* App setup */
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}${server.graphqlPath}`);
    });
};

startServer();