import { User } from '@Models/User';
import { Recipe } from '@Models/Recipe';
import { Comment } from '@Models/Comment';
import { ApolloError } from 'apollo-server-express';
import fs from 'fs';
import path from 'path';
import { setUrlName } from '@Utils/recipe-resolvers.utils';
import { RecipeErrors } from '@Enums/recipe-errors.enum';
import { HTTPStatusCodes } from '@Enums/http-status-code.enum';

const recipeResolvers = {
  /* Types to relation DBs */
  Recipe: {
    author: async ({ author }) => {
      const user = await User.findById(author);

      return user;
    },
    comments: async (recipe, { offset, limit }) => {
      const recipeComments = await Comment.find({ recipe: recipe._id })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
      return recipeComments;
    },
  },

  CommentsRecipe: {
    author: async ({ author }) => {
      const user = await User.findById(author);
      return user;
    },
  },

  Query: {
    getRecipe: async (_, { recipeUrl }) => {
      /* Check if recipe exists */
      const recipe = await Recipe.findOne({ url: recipeUrl });

      if (!recipe) {
        throw new ApolloError(
          RecipeErrors.RECIPE_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      }

      return recipe;
    },

    getRecipes: async (_, { offset = 0, limit = 20, sort = '-createdAt' }) => {
      try {
        const recipes = await Recipe.find({})
          .sort(sort)
          .skip(offset)
          .limit(limit)
          .exec();

        return recipes;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    newRecipe: async (_, { input }, ctx) => {
      try {
        const sameRecipes = await Recipe.countDocuments({
          name: input.name,
        }).collation({ locale: 'en', strength: 2 });

        const urlName = setUrlName({ url: input.name, sameRecipes });
        const newRecipe = await Recipe.create({
          ...input,
          url: urlName,
          author: ctx.req.user._id,
        });

        return newRecipe;
      } catch (error) {
        console.log(error);
      }
    },

    deleteRecipe: async (_, { _id }, ctx) => {
      try {
        /* Check if recipe exists // Author is the one who deletes the order */
        const recipe = await Recipe.findById(_id);

        if (!recipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (recipe.author.toString() !== ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.INVALID_CREDENTIALS,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Delete recipe image from server */
        const pathName = path.join(
          process.cwd(),
          `/images/${recipe.image_name}`
        );

        fs.unlinkSync(pathName);

        /* Delete data from DB */
        await Comment.deleteMany({ recipe: _id });
        await Recipe.findOneAndDelete({ _id });

        return true;
      } catch (error) {
        throw error;
      }
    },

    voteRecipe: async (_, { recipeUrl, input }, ctx) => {
      const { votes } = input;

      try {
        /* Check if recipe exists */
        let recipe = await Recipe.findOne({ url: recipeUrl });

        if (!recipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        }

        /* Check if user has voted */
        if (!ctx.req.user) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (recipe.voted.includes(ctx.req.user._id)) {
          throw new ApolloError(
            RecipeErrors.RECIPE_VOTED,
            HTTPStatusCodes.NOT_ACCEPTABLE
          );
        }

        recipe.votes += votes;
        recipe.voted = [...recipe.voted, ctx.req.user._id];

        /* Calculate total votes and save data in DB */
        const averageVotes = recipe.votes / recipe.voted.length;
        const adjustMean =
          (Math.ceil(averageVotes) + Math.floor(averageVotes)) / 2;

        recipe.average_vote = adjustMean;

        await recipe.save();

        return recipe;
      } catch (error) {
        throw error;
      }
    },

    /* Comments Recipe */
    sendCommentRecipe: async (_, { recipeUrl, input }, ctx) => {
      try {
        /* Check errors */
        let recipe = await Recipe.findOne({ url: recipeUrl });

        if (!recipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (!ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (!input.message) {
          throw new ApolloError(
            RecipeErrors.NO_MESSAGE,
            HTTPStatusCodes.NO_CONTENT
          );
        }

        const newComment = await Comment.create({
          ...input,
          author: ctx.req.user._id,
          recipe: recipe._id,
        });

        return newComment;
      } catch (error) {
        throw error;
      }
    },

    editCommentRecipe: async (_, { _id, input }, ctx) => {
      try {
        /* Check if comment exists */
        let comment = await Comment.findById(_id);

        if (!comment) {
          throw new ApolloError(
            RecipeErrors.COMMENT_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (!ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        }

        /* Edit the comment text and save data in DB */
        comment = await Comment.findOneAndUpdate({ _id }, input, {
          new: true,
        });

        return comment;
      } catch (error) {
        throw error;
      }
    },

    voteCommentRecipe: async (_, { _id, input }, ctx) => {
      try {
        let comment = await Comment.findById(_id);

        /* Check if comment exists */
        if (!comment) {
          throw new ApolloError(
            RecipeErrors.COMMENT_NOT_FOUND,
            HTTPStatusCodes.NOT_FOUND
          );
        } else if (!ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HTTPStatusCodes.NOT_AUTHORIZED
          );
        } else if (comment.voted.includes(ctx.req.user._id)) {
          throw new ApolloError(
            RecipeErrors.COMMENT_VOTED,
            HTTPStatusCodes.NOT_ACCEPTABLE
          );
        }

        /* Add user who voted and sum votes */
        comment.voted = [...comment.voted, ctx.req.user._id];
        comment.votes += input.votes;

        await comment.save();

        return comment;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default recipeResolvers;
