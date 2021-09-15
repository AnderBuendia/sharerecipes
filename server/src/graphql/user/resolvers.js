// @ts-nocheck
const User = require('../../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../../utils/auth.utils');
const { ApolloError } = require('apollo-server-express');
const { sendEmails } = require('../../utils/sendEmails.utils');
const UserErrors = require('../../enums/user.errors');
const HTTPStatusCodes = require('../../enums/http-status-code');
const {
  usernameValidation,
  emailValidation,
  passwordValidation,
} = require('../../utils/formValidation.utils');
require('dotenv').config({ path: 'src/variables.env' });

/* User Resolvers */
const resolvers = {
  Query: {
    getUser: async (_, {}, ctx) => {
      if (!ctx.req.user) {
        return null;
      }

      try {
        return await User.findById(ctx.req.user._id);
      } catch (error) {
        console.log(error);
      }
    },

    getUsers: async (_, { offset = 0, limit = 10 }) => {
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
    newUser: async (_, { input }) => {
      const { name, email, password } = input;

      try {
        /* Check if user is already registered */
        let user = await User.findOne({ email });

        if (!usernameValidation(name)) {
          throw new ApolloError(
            UserErrors.USERNAME_FORMAT,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (!emailValidation(email)) {
          throw new ApolloError(
            UserErrors.EMAIL_FORMAT,
            HTTPStatusCodes.NOT_ACCEPTABLE
          );
        } else if (!passwordValidation(password)) {
          throw new ApolloError(
            UserErrors.PASSWORD,
            HTTPStatusCodes.NOT_ACCEPTABLE
          );
        } else if (user) {
          throw new ApolloError(
            UserErrors.REGISTERED,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        user = new User({
          ...input,
          password: bcrypt.hashSync(password, 10),
        });

        await user.save();

        /* Send an activation mail */
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_EMAIL, {
          expiresIn: '1h',
        });

        const mailContent = {
          url: `${process.env.HOST_FRONT}/confirmation/${token}`,
          text: 'Activate your Account',
        };

        await sendEmails(user.email, mailContent);

        return token;
      } catch (error) {
        throw error;
      }
    },

    authenticateUser: async (_, { input }) => {
      const { email, password } = input;

      try {
        /* Check if user exists and if password is correct */
        let user = await User.findOne({ email });

        if (!emailValidation(email)) {
          throw new ApolloError(
            UserErrors.EMAIL_FORMAT,
            HTTPStatusCodes.NOT_ACCEPTABLE
          );
        } else if (!user) {
          throw new ApolloError(
            UserErrors.USER_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (!bcrypt.compareSync(password, user.password)) {
          throw new ApolloError(
            UserErrors.PASSWORD,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (user && !user.confirmed) {
          throw new ApolloError(
            UserErrors.NOT_ACTIVATED,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }
        const token = createAccessToken(user);

        return {
          token,
          user: { ...user.toJSON() },
        };
      } catch (error) {
        throw error;
      }
    },

    updateUser: async (_, { input }, ctx) => {
      const { email, name, password } = input;

      try {
        /* Check if user exists // user is the editor // password is correct */
        let user = await User.findOne({ email });

        if (!user) {
          throw new ApolloError(
            UserErrors.USER_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (!ctx.req.user && ctx.req.user._id !== user._id) {
          throw new ApolloError(
            UserErrors.INVALID_CREDENTIALS,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (!bcrypt.compareSync(password, user.password)) {
          throw new ApolloError(
            UserErrors.CURRENT_PASSWORD,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Save data in DB */
        user.name = name;
        await user.save();

        return user;
      } catch (error) {
        throw error;
      }
    },

    updateUserPassword: async (_, { input }, ctx) => {
      const { email, password, confirmPassword } = input;

      try {
        /* Check if user exists // user is the editor // password is correct */
        let user = await User.findOne({ email });

        if (!user) {
          throw new ApolloError(
            UserErrors.USER_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (!ctx.req.user && ctx.req.user._id !== user._id) {
          throw new ApolloError(
            UserErrors.INVALID_CREDENTIALS,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (!bcrypt.compareSync(password, user.password)) {
          throw new ApolloError(
            UserErrors.CURRENT_PASSWORD,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Save data in DB */
        user.password = bcrypt.hashSync(confirmPassword, 10);
        await user.save();

        return true;
      } catch (error) {
        throw error;
      }
    },

    deleteUser: async (_, { email }, ctx) => {
      try {
        /* Check if user exists */
        const checkUser = await User.findOne({ email });

        if (!checkUser) {
          return new ApolloError(
            UserErrors.USER_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        }

        /* Check if the admin is the one who deletes the user */
        const adminUser = await User.findById(ctx.req.user._id);

        if (adminUser.role !== 'ADMIN') {
          return new ApolloError(
            UserErrors.INVALID_CREDENTIALS,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Delete data from DB */
        await User.findOneAndDelete({ email });

        return true;
      } catch (error) {
        console.log(error);
      }
    },

    /* Confirm account */
    confirmUser: async (_, { input }) => {
      const { token } = input;

      try {
        const user = jwt.verify(token, process.env.SECRET_EMAIL);
        await User.findByIdAndUpdate({ _id: user._id }, { confirmed: true });

        return true;
      } catch (error) {}
    },

    /* Recovery Password */
    forgotPassword: async (_, { input }) => {
      const { email } = input;

      try {
        /* Check if user is already registered */
        const user = await User.findOne({ email });

        if (!user) {
          return new ApolloError(
            UserErrors.EMAIL_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        }

        /* Send an activation mail */
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.SECRET_FORGOT,
          {
            expiresIn: '1h',
          }
        );

        const mailContent = {
          url: `${process.env.HOST_FRONT}/forgot-pass/${token}`,
          text: 'Change your Password',
        };

        await sendEmails(email, mailContent);

        return token;
      } catch (error) {
        console.log(error);
      }
    },

    resetPassword: async (_, { input }) => {
      const { token, password } = input;

      try {
        let user = jwt.verify(
          token,
          process.env.SECRET_FORGOT,
          function (err, user) {
            if (err) {
              return new ApolloError(
                UserErrors.LINK_EXPIRED,
                HTTPStatusCodes.NOT_AUTHORIZED
              );
            }

            return user;
          }
        );

        /* Save data in DB */
        await User.findOneAndUpdate(
          {
            _id: user._id,
          },
          {
            password: bcrypt.hashSync(password, 10),
          },
          {
            new: true,
          }
        );

        return true;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return attemptRenewal();
        }

        return new ApolloError(error, HTTPStatusCodes.NOT_AUTHORIZED);
      }
    },
  },
};

module.exports = resolvers;
