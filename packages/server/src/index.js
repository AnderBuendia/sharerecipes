const User = require('./models/User');

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db/database');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
        origin: process.env.FRONTEND_URL,
        credentials: true
    }));

    /* Read JSON body values */
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(cookieParser());

    /* Images dir */
    existsSync(path.join(__dirname, '/images')) || mkdirSync(path.join(__dirname, "/images"));
    app.use("/images", express.static(path.join(__dirname, "/images")));
    
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

        /* Refresh Token Validation */
        let isRefreshTokenValid = false;

        user.refreshTokens = user.refreshTokens.filter(storedToken => {
            const isMatch = bcrypt.compareSync(token, storedToken.hash);
            const isValid = storedToken.expiry > Date.now();
            if (isMatch && isValid) {
                isRefreshTokenValid = true;
            }

            return !isMatch && isValid;
        });

        if (!isRefreshTokenValid) throw new Error('Invalid refresh token');

        const newRefreshToken = createRefreshToken(user);
        
        /* Save data Token to refresh in DB */
        const newRefreshTokenExpiry = new Date();
        newRefreshTokenExpiry.setHours(newRefreshTokenExpiry.getHours() + 4);
        newRefreshTokenExpiry.setMilliseconds(0);


        const salt = await bcrypt.genSalt(10);
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, salt);

        user.refreshTokens.push({
            hash: newRefreshTokenHash,
            expiry: newRefreshTokenExpiry,
        });

        await user.save();

        sendRefreshToken(res, newRefreshToken)
        
        return res.send({ ok: true, accessToken: createAccessToken(user) })
    });

    /* Route to upload images with multer */
    app.use('/upload', require('./routes/uploads'));

    server.applyMiddleware({ app, cors: false });

    /* App port */
    const port = process.env.PORT || 4000;

    /* App setup */
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}${server.graphqlPath}`);
    });
};

startServer();