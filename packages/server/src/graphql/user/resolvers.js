const User = require('../../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../../utils/auth.utils');
const { ApolloError } = require('apollo-server-express');
const { sendEmails } = require('../../utils/sendEmails.utils');
const UserErrors = require('../../enums/user.errors');
const HTTPStatusCodes = require('../../enums/http-status-code');
require('dotenv').config({ path: 'src/variables.env' });

/* User Resolvers */
const resolvers = {
    Query: {
        getUser: async (_, {}, ctx) => {
            if (!ctx.req.user) {
                return null;
            }
            
            return await User.findById(ctx.req.user.id);
        },
        
        getUsers: async (_, {offset = 0, limit = 10}) => {
            try {
                const users = await User.find({}).skip(offset).limit(limit).exec();
                const total = await User.countDocuments({});

                return { users, total };
            } catch (error) {
                console.log(error);
            }
        },
    },

    Mutation: {
        /* Users */
        newUser: async (_, {input}) => {
            const { email, password } = input;

            /* Check if user is already registered */
            let user = await User.findOne({ email });

            if (user) {
                throw new ApolloError(UserErrors.REGISTERED, HTTPStatusCodes.NOT_AUTHORIZED);
            }

            /* Hashing password */
            const salt = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);

            try {
                user = new User(input);
                await user.save();

                /* Send an activation mail */
                const emailToken = jwt.sign({ id: user.id }, process.env.SECRET_EMAIL, { expiresIn: '1h'});
                const url = `${process.env.HOST_FRONT}/confirmation/${emailToken}`;
                const contentHTML = `<h1>Click on this link to activate your account</h1>
                                <a href=${url}>${url}</a>`;

                await sendEmails(user.email, contentHTML);

                return true;      
            } catch (error) {
                console.log(error);
            }
        },

        authenticateUser: async (_, {input}) => {
            const { email, password } = input;
            
            /* Check if user is exists */
            const user = await User.findOne({ email });

            if (!user) {
                throw new ApolloError(UserErrors.USER_NOT_FOUND, HTTPStatusCodes.NOT_FOUND); 
            } else if (user && !user.confirmed) {
                throw new ApolloError(UserErrors.NOT_ACTIVATED, HTTPStatusCodes.NOT_AUTHORIZED); 
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
            
            if (!checkPassword) {
                throw new ApolloError('Password is wrong', 401);
            }

            const token = createAccessToken(user);
            await user.save();

            return { 
                token,
                user: { ...user.toJSON() }
            };
        },

        updateUser: async (_, {input}, ctx) => {
            const { email, name, password } = input;
            console.log(input)
            /* Check if user exists */
            let user = await User.findOne({ email });

            if (!user) {
                throw new ApolloError(UserErrors.USER_NOT_FOUND, HTTPStatusCodes.NOT_FOUND);
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new ApolloError(UserErrors.INVALID_CREDENTIALS, HTTPStatusCodes.NOT_AUTHORIZED);
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
    
            if (!checkPassword) {
                throw new ApolloError(UserErrors.CURRENT_PASSWORD, HTTPStatusCodes.NOT_AUTHORIZED);
            }

            delete input.password;
        
            /* Save data in DB */
            user = await User.findOneAndUpdate({ email }, name, {
                new: true
            });

            return user;
        },

        updateUserPassword: async (_, {input}, ctx) => {
            const { email, password, confirmpassword } = input;

            /* Check if user exists */
            let user = await User.findOne({ email });

            if (!user) {
                throw new ApolloError(UserErrors.USER_NOT_FOUND, HTTPStatusCodes.NOT_FOUND);
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new ApolloError(UserErrors.INVALID_CREDENTIALS, HTTPStatusCodes.NOT_AUTHORIZED);
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
        
            if (!checkPassword) {
                throw new ApolloError(UserErrors.CURRENT_PASSWORD, HTTPStatusCodes.NOT_AUTHORIZED);
            }

            /* Hashing new password */
            const salt = await bcrypt.genSalt(10);
            const newpassword = await bcrypt.hash(confirmpassword, salt);

            /* Save data in DB */
            user = await User.findOneAndUpdate({ email }, { password: newpassword }, {
                new: true
            });

            return true;
        },

        deleteUser: async (_, {email}, ctx) => {
            /* Check if user exists */
            const checkUser = await User.findOne({ email });

            if (!checkUser) {
                throw new ApolloError(UserErrors.USER_NOT_FOUND, HTTPStatusCodes.NOT_FOUND);
            }

            /* Check if the admin is the one who deletes the user */
            const adminUser = await User.findById(ctx.req.user.id);

            if (adminUser.role !== 'ADMIN') {
                throw new ApolloError(UserErrors.INVALID_CREDENTIALS, HTTPStatusCodes.NOT_AUTHORIZED);
            }

            /* Delete data from DB */
            await User.findOneAndDelete({ email });
            
            return true;
        },

        /* Confirm account */
        confirmUser: async (_, {input}) => {
            const { token } = input;
            console.log(token)
            try {
                const user = jwt.verify(token, process.env.SECRET_EMAIL);
                await User.findByIdAndUpdate({ _id: user.id }, { confirmed: true });
                
                console.log(user)
                return true;
            } catch (error) {
            }
        },

        /* Recovery Password */
        forgotPassword: async (_, {input}) => {
            const { email } = input;
            /* Check if user is already registered */
            let user = await User.findOne({ email });

            if (!user) {
                throw new ApolloError(UserErrors.EMAIL_NOT_FOUND, HTTPStatusCodes.NOT_FOUND);
            }

            try {
                /* Send an activation mail */
                const forgotToken = jwt.sign({ id: user.id }, process.env.SECRET_FORGOT, { expiresIn: '1h'});
                const url = `${process.env.HOST_FRONT}/forgot-pass/${forgotToken}`;
                const contentHTML = `<h1>Click on this link to change your current password</h1>
                                <a href=${url}>${url}</a>`;

                await sendEmails(user, contentHTML);

                return true;   
            } catch (error) {
                console.log(error);
            }
        },

        resetPassword: async (_, {input}) => {
            const { token, password } = input;
            try {
                let user = jwt.verify(token, process.env.SECRET_FORGOT, function(err, user) {
                    if (err) {
                        throw new ApolloError(UserErrors.LINK_EXPIRED, HTTPStatusCodes.NOT_AUTHORIZED);    
                    }

                    return user;
                });

                /* Hashing new password */
                const salt = await bcrypt.genSalt(10);
                const newpassword = await bcrypt.hash(password, salt);

                /* Save data in DB */
                user = await User.findOneAndUpdate({ _id: user.id}, { password: newpassword }, {
                    new: true
                });

                return true;
            } catch (error) {
                if(error instanceof jwt.TokenExpiredError) {
                    return attemptRenewal()
                }
                throw new ApolloError(error, HTTPStatusCodes.NOT_AUTHORIZED);
            }
        },
    }
};

module.exports = resolvers;