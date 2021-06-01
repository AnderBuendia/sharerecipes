// @ts-nocheck
const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const Comment = require('../../models/Comment');

const { ApolloError } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const RecipeErrors = require('../../enums/recipe.errors');
const HttpStatusCode = require('../../enums/http-status-code');

const resolvers = {
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
          HttpStatusCode.NOT_FOUND
        );
      }

      return recipe;
    },

    getRecipes: async (_, { offset = 0, limit = 20 }) => {
      try {
        const recipes = await Recipe.find({})
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .exec();

        return recipes;
      } catch (error) {
        console.log(error);
      }
    },

    getBestRecipes: async (_, { offset = 0, limit = 20 }) => {
      try {
        const recipes = await Recipe.find({})
          .sort({ average_vote: -1 })
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
      const urlName = input.name.replace(' ', '-').toLowerCase();

      try {
        const recipes = await Recipe.countDocuments({
          name: input.name,
        }).collation({ locale: 'en', strength: 2 });

        if (recipes > 0) {
          input.url = `${urlName}-${recipes}`;
        } else {
          input.url = urlName;
        }

        const newRecipe = new Recipe({
          ...input,
          author: ctx.req.user._id,
        });

        /* Save data in DB */
        await newRecipe.save();

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
            HttpStatusCode.NOT_FOUND
          );
        } else if (recipe.author.toString() !== ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.INVALID_CREDENTIALS,
            HttpStatusCode.NOT_AUTHORIZED
          );
        }

        /* Delete recipe image from server */
        const pathName = path.join(
          __dirname,
          `../../images/${recipe.image_name}`
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
        let checkRecipe = await Recipe.findOne({ url: recipeUrl });

        if (!checkRecipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }

        /* Check if user has voted */
        if (!ctx.req.user) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HttpStatusCode.NOT_AUTHORIZED
          );
        } else if (checkRecipe.voted.includes(ctx.req.user._id)) {
          throw new ApolloError(
            RecipeErrors.RECIPE_VOTED,
            HttpStatusCode.NOT_ACCEPTABLE
          );
        }

        checkRecipe.votes = !votes
          ? checkRecipe.average_vote * 2
          : checkRecipe.votes + votes;

        checkRecipe.voted = [...checkRecipe.voted, ctx.req.user._id];

        /* Calculate total votes and save data in DB */
        const averageVotes = checkRecipe.votes / checkRecipe.voted.length;
        const adjustMean =
          (Math.ceil(averageVotes) + Math.floor(averageVotes)) / 2;

        checkRecipe.average_vote =
          averageVotes < adjustMean ? averageVotes : adjustMean;

        await checkRecipe.save();

        return checkRecipe;
      } catch (error) {
        throw error;
      }
    },

    /* Comments Recipe */
    sendCommentsRecipe: async (_, { recipeUrl, input }, ctx) => {
      try {
        /* Check errors */
        let recipe = await Recipe.findOne({ url: recipeUrl });

        if (!recipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        } else if (!ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HttpStatusCode.NOT_AUTHORIZED
          );
        } else if (!input.message) {
          throw new ApolloError(
            RecipeErrors.NO_MESSAGE,
            HttpStatusCode.NO_CONTENT
          );
        }

        const newComment = new Comment({
          ...input,
          author: ctx.req.user._id,
          recipe: recipe._id,
        });

        await newComment.save();

        return newComment;
      } catch (error) {
        throw error;
      }
    },

    editCommentsRecipe: async (_, { _id, input }, ctx) => {
      try {
        /* Check if comment exists */
        let checkComment = await Comment.findById(_id);

        if (!checkComment) {
          throw new ApolloError(
            RecipeErrors.COMMENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        } else if (!ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HttpStatusCode.NOT_AUTHORIZED
          );
        }

        /* Edit the comment text and save data in DB */
        checkComment = await Comment.findOneAndUpdate({ _id }, input, {
          new: true,
        });

        return checkComment;
      } catch (error) {
        throw error;
      }
    },

    voteCommentsRecipe: async (_, { _id, input }, ctx) => {
      try {
        let checkComment = await Comment.findById(_id);

        /* Check if comment exists */
        if (!checkComment) {
          throw new ApolloError(
            RecipeErrors.COMMENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        } else if (!ctx.req.user._id) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HttpStatusCode.NOT_AUTHORIZED
          );
        } else if (checkComment.voted.includes(ctx.req.user._id)) {
          throw new ApolloError(
            RecipeErrors.COMMENT_VOTED,
            HttpStatusCode.NOT_ACCEPTABLE
          );
        }

        /* Add user who voted and sum votes */
        checkComment.voted = [...checkComment.voted, ctx.req.user._id];
        checkComment.votes += input.votes;

        await checkComment.save();

        return checkComment;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = resolvers;
