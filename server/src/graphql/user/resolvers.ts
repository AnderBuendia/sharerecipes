import { User } from '@Models/User';
import { compareSync, hashSync } from 'bcrypt';
import { TokenExpiredError } from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import { signToken, verifyToken } from '@Utils/auth.utils';
import { sendEmails } from '@Utils/sendEmails.utils';
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
} from '@Utils/formValidation.utils';
import { UserErrors } from '@Enums/user-errors.enum';
import { HTTPStatusCodes } from '@Enums/http-status-code.enum';
import { MailContent } from '@Enums/mail-content.enum';
require('dotenv').config({ path: 'src/variables.env' });

/* User Resolvers */
const userResolvers = {
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

        user = await User.create({
          ...input,
          password: hashSync(password, 10),
        });

        /* Send an activation mail */
        const token = signToken({
          _id: user._id,
          code: process.env.SECRET_EMAIL,
        });

        const mailContent = {
          url: `${process.env.HOST_FRONT}/confirmation/${token}`,
          text: MailContent.ACTIVATE_ACCOUNT,
        };

        if (process.env.NODE_ENV !== 'test') {
          await sendEmails({ email: user.email, mailContent });
        }

        return token;
      } catch (error) {
        throw error;
      }
    },

    authenticateUser: async (_, { input }) => {
      const { email, password } = input;

      try {
        if (!emailValidation(email)) {
          throw new ApolloError(
            UserErrors.EMAIL_FORMAT,
            HTTPStatusCodes.NOT_ACCEPTABLE
          );
        }

        let user = await User.findOne({ email });

        if (!user) {
          throw new ApolloError(
            UserErrors.USER_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (user && !user.confirmed) {
          throw new ApolloError(
            UserErrors.NOT_ACTIVATED,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        const validPassword = compareSync(password, user.password);

        if (!validPassword) {
          throw new ApolloError(
            UserErrors.PASSWORD,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        const token = signToken({
          _id: user._id,
          code: process.env.SECRET_JWT_ACCESS,
          time: '12h',
        });

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
        }

        const validPassword = compareSync(password, user.password);

        if (!validPassword) {
          throw new ApolloError(
            UserErrors.CURRENT_PASSWORD,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Save data in DB */
        user = await User.findByIdAndUpdate(
          { _id: user._id },
          { name },
          { new: true }
        );

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
        }

        const validPassword = compareSync(password, user.password);

        if (!validPassword) {
          throw new ApolloError(
            UserErrors.CURRENT_PASSWORD,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Save data in DB */
        await User.findByIdAndUpdate(
          { _id: user._id },
          { password: hashSync(confirmPassword, 10) }
        );

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
        const userId = verifyToken({ token, code: process.env.SECRET_EMAIL });

        await User.findByIdAndUpdate({ _id: userId }, { confirmed: true });

        return true;
      } catch (error) {
        console.log(error);
      }
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
        const token = signToken({
          _id: user._id,
          code: process.env.SECRET_FORGOT,
        });

        const mailContent = {
          url: `${process.env.HOST_FRONT}/forgot-pass/${token}`,
          text: MailContent.CHANGE_PASSWORD,
        };

        if (process.env.NODE_ENV !== 'test') {
          await sendEmails({ email, mailContent });
        }

        return token;
      } catch (error) {
        console.log(error);
      }
    },

    resetPassword: async (_, { input }, ctx) => {
      const { token, password } = input;

      try {
        let userId = verifyToken({ token, code: process.env.SECRET_FORGOT });

        /* Save data in DB */
        await User.findByIdAndUpdate(
          { _id: userId },
          { password: hashSync(password, 10) }
        );

        return true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          return ctx.res.json({
            status: 'Failure',
            msg: 'TOKEN_EXPIRED',
            details: {
              error: 'Sign in token expired',
            },
          });
        }

        return new ApolloError(error, HTTPStatusCodes.NOT_AUTHORIZED);
      }
    },
  },
};

export default userResolvers;
