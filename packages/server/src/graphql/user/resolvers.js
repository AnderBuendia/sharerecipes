const User = require('../../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { createAccessToken } = require('../../utils/auth.utils');
const { ApolloError } = require('apollo-server-express');
require('dotenv').config({ path: 'src/config/variables.env' });

/* Other fns */
const sendEmails = async (email, contentHTML) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAILU,
            pass: process.env.EMAILP
        }
    });
  
    const mailOptions = {
        from: "no-reply@shareyourrecipes.com",
        to: email,
        subject: "Activate your Account",
        html: contentHTML 
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred', error.message);
        } else {
            console.log('Email sent', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    })
}

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
                throw new ApolloError('User is already registered', 401);
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

                return { message: `User was created succesfully created.
                    Please, check your email to confirm your account.` };      
            } catch (error) {
                console.log(error);
            }
        },

        authenticateUser: async (_, {input}) => {
            const { email, password } = input;
            
            /* Check if user is exists */
            const user = await User.findOne({ email });

            if (!user) {
                throw new ApolloError('User does not exist', 401); 
            } else if (user && !user.confirmed) {
                throw new ApolloError('Your account has not activated. Please check your email', 401); 
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
                throw new ApolloError('User does not exist', 401);
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new ApolloError('Invalid credentials', 401);
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
    
            if (!checkPassword) {
                throw new ApolloError('Your current password is wrong', 401);
            }

            delete input.password;
        
            /* Save data in DB */
            user = await User.findOneAndUpdate({ email }, name, {
                new: true
            });

            return user;
        },

        updateUserPassword: async (_, {id, input}, ctx) => {
            const { password, confirmpassword } = input;

            /* Check if user exists */
            let user = await User.findById(id);

            if (!user) {
                throw new ApolloError('User does not exist', 401);
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new ApolloError('Invalid credentials', 401);
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
        
            if (!checkPassword) {
                throw new ApolloError('Your current password is wrong', 401);
            }

            /* Hashing new password */
            const salt = await bcrypt.genSalt(10);
            const newpassword = await bcrypt.hash(confirmpassword, salt);

            /* Save data in DB */
            user = await User.findOneAndUpdate({ _id: id}, { password: newpassword }, {
                new: true
            });
  
            return user;
        },

        deleteUser: async (_, {id}, ctx) => {
            /* Check if user exists */
            const checkUser = await User.findById(id);

            if (!checkUser) {
                throw new ApolloError('User does not exist', 401);
            }

            /* Check if the admin is the one who deletes the user */
            const adminUser = await User.findById(ctx.req.user.id);

            if (adminUser.role !== 'Admin') {
                throw new ApolloError('Invalid credentials', 401);
            }

            /* Delete data from DB */
            await User.findOneAndDelete({ _id: id });
            return 'User has been deleted';
        },

        /* Confirm account */
        confirmUser: async (_, {input}) => {
            const { token } = input;
            try {
                const user = jwt.verify(token, process.env.SECRET_EMAIL);
                await User.findByIdAndUpdate({ _id: user.id }, { confirmed: true });
                
                return { message: `Your account has been activated.
                    You will be redirected automatically to login` };
            } catch (error) {
            }
        },

        /* Recovery Password */
        forgotPassword: async (_, {input}) => {
            const { email } = input;
            /* Check if user is already registered */
            let user = await User.findOne({ email });

            if (!user) {
                throw new ApolloError('This email does not registered', 401);
            }

            try {
                /* Send an activation mail */
                const forgotToken = jwt.sign({ id: user.id }, process.env.SECRET_FORGOT, { expiresIn: '1h'});
                const url = `${process.env.HOST_FRONT}/forgot-pass/${forgotToken}`;
                const contentHTML = `<h1>Click on this link to change your current password</h1>
                                <a href=${url}>${url}</a>`;

                await sendEmails(user, contentHTML);

                return { message: `Please check your email 
                    and follow the instructions` };   
            } catch (error) {
                console.log(error);
            }
        },

        resetPassword: async (_, {input}) => {
            const { token, password } = input;
            try {
                let user = jwt.verify(token, process.env.SECRET_FORGOT, function(err, user) {
                    if (err) {
                        throw new ApolloError('Link has expired. Try to send a new link', 401);    
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

                return { message: `Your password has been changed.
                You will be redirected automatically to login` };
            } catch (error) {
                if(error instanceof jwt.TokenExpiredError) {
                    return attemptRenewal()
                }
                throw new ApolloError(error, 401);
            }
        },
    }
};

module.exports = resolvers;