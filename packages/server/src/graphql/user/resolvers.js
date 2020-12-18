const User = require('../../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { createAccessToken, createRefreshToken } = require('../../utils/auth');
const sendRefreshToken = require('../../utils/sendRefreshToken');
require('dotenv').config({ path: 'src/config/variables.env' });

/* Other fns */
const sendEmails = async (user, contentHTML) => {
    const { email } = user;

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
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
            console.log('Error ocurred', err.message);
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
            //console.log(input);
            const { email, password } = input;

            /* Check if user is already registered */
            let user = await User.findOne({ email });

            if (user) {
                throw new Error(JSON.stringify({
                    errorMessage: 'User is already registered', 
                    classError: 'error'
                }));
            }

            /* Hashing password */
            const salt = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);

            try {
                user = new User(input);
                await user.save();

                /* Send an activation mail */
                const emailToken = jwt.sign({ id: user.id }, process.env.SECRET_EMAIL, { expiresIn: '1h'});
                const url = `${process.env.FRONTEND_URL}/confirmation/${emailToken}`;
                const contentHTML = `<h1>Click on this link to activate your account</h1>
                                <a href=${url}>${url}</a>`;

                await sendEmails(user, contentHTML);

                return user;      
            } catch (error) {
                console.log(error);
            }
        },

        authenticateUser: async (_, {input}, { res }) => {
            const { email, password } = input;

            /* Check if user is exists */
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error(JSON.stringify({
                    errorMessage: 'User does not exist',
                    classError: 'error'
                })); 
            } else if (user && !user.confirmed) {
                throw new Error(JSON.stringify({
                    errorMessage: 'Your account has not activated. Please check your email',
                    classError: 'error'
                })); 
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
            
            if (!checkPassword) {
                throw new Error(JSON.stringify({
                    errorMessage: 'Password is wrong',
                    classError: 'error'
                }));
            }

            const refreshToken = createRefreshToken(user);

            /* Save data Token to refresh in DB */
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setHours(refreshTokenExpiry.getHours() + 4);
            refreshTokenExpiry.setMilliseconds(0);

            const salt = await bcrypt.genSalt(10);
            const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

            user.refreshTokens.push({
                hash: refreshTokenHash,
                expiry: refreshTokenExpiry,
            });

            await user.save();

            /* Set cookie token */
            sendRefreshToken(res, refreshToken);

            return { accessToken: createAccessToken(user) };
        },

        signOutUser: async (_, {}, ctx) => {
            const user = await User.findById(ctx.req.user.id);
            const token = ctx.req.cookies.jid;

            /* find matching token in database and filter it out */
            user.refreshTokens = user.refreshTokens.filter(storedToken => 
                !bcrypt.compareSync(token, storedToken.hash)
            );

            await user.save();
            
            /* Send void data to the cookie */
            sendRefreshToken(ctx.res, "");
            return true;
        },

        updateUser: async (_, {id, input}, ctx) => {
            /* Check if user exists */
            let user = await User.findById(id);

            if (!user) {
                throw new Error(JSON.stringify({
                    errorMessage: 'User does not exist',
                    classError: 'error'
                }));
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new Error(JSON.stringify({
                    errorMessage: 'Invalid credentials',
                    classError: 'error'
                }));
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(input.password, user.password);
    
            if (!checkPassword) {
                throw new Error(JSON.stringify({
                    errorMessage: 'Your current password is wrong',
                    classError: 'error'
                }));
            }

            delete input.password;
        
            /* Save data in DB */
            user = await User.findOneAndUpdate({ _id: id}, input, {
                new: true
            });

            return user;
        },

        updateUserPassword: async (_, {id, input}, ctx) => {
            const { password, confirmpassword } = input;

            /* Check if user exists */
            let user = await User.findById(id);

            if (!user) {
                throw new Error('User does not exist');
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new Error(JSON.stringify({
                    errorMessage: 'Invalid credentials',
                    classError: 'error'
                }));
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
        
            if (!checkPassword) {
                throw new Error(JSON.stringify({
                    errorMessage: 'Your current password is wrong',
                    classError: 'error'
                }));
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
                throw new Error(JSON.stringify({
                    errorMessage: 'User does not exist',
                    classError: 'error'
                }));
            }

            /* Check if the admin is the one who deletes the user */
            const adminUser = await User.findById(ctx.req.user.id);

            if (adminUser.role !== 'Admin') {
                throw new Error(JSON.stringify({
                    errorMessage: 'Invalid credentials',
                    classError: 'error'
                }));
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
                
                return `Your account has been activated.
                    You will be redirected automatically to login`;
            } catch (error) {
            }
        },

        /* Recovery Password */
        forgotPassword: async (_, {input}) => {
            const { email } = input;
            /* Check if user is already registered */
            let user = await User.findOne({ email });

            if (!user) {
                throw new Error(JSON.stringify({
                    errorMessage: 'This email does not registered',
                    classError: 'error'
                }));
            }

            try {
                /* Send an activation mail */
                const forgotToken = jwt.sign({ id: user.id }, process.env.SECRET_FORGOT, { expiresIn: '1h'});
                const url = `${process.env.FRONTEND_URL}/forgot/${forgotToken}`;
                const contentHTML = `<h1>Click on this link to change your current password</h1>
                                <a href=${url}>${url}</a>`;

                await sendEmails(user, contentHTML);

                return 'Please check your email and follow the instructions';   
            } catch (error) {
                console.log(error);
            }
        },

        resetPassword: async (_, {input}) => {
            const { token, password } = input;
            try {
                let user = jwt.verify(token, process.env.SECRET_FORGOT, function(err, user) {
                    if (err) {
                        throw new Error(JSON.stringify({
                            errorMessage: 'Link has expired. Try to send a new link',
                            errorClass: 'error'
                        }));    
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

                return `Your password has been changed.
                    You will be redirected automatically to login`;
            } catch (error) {
                if(error instanceof jwt.TokenExpiredError) {
                    return attemptRenewal()
                }
                throw new Error(error);
            }
        },
    }
};

module.exports = resolvers;