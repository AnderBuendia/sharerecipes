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
    comments: async ({ comments }, { offset, limit }) => {
      const recipeComments = await Comment.find({ _id: { $in: comments } })
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

    getRecipes: async (_, { offset = 0, limit = 10 }) => {
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

    getBestRecipes: async () => {
      try {
        const recipes = await Recipe.find({}).sort({ average_vote: -1 });
        return recipes;
      } catch (error) {
        console.log(error);
      }
    },

    /* Recipe comments */
    getNumberOfComments: async (_, { recipeUrl }) => {
      try {
        /* Check recipe */
        const recipe = await Recipe.findOne({ url: recipeUrl });

        if (!recipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }

        /* Get comments from this recipe */
        const comments = await Comment.find({ _id: { $in: recipe.comments } });
        return comments;
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

        const newInput = {
          ...input,
          author: ctx.req.user.id,
        };

        const newRecipe = new Recipe(newInput);

        /* Save data in DB */
        const res = await newRecipe.save();
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    deleteRecipe: async (_, { recipeUrl }, ctx) => {
      try {
        /* Check if recipe exists // Author is the one who deletes the order */
        const recipe = await Recipe.findOne({ url: recipeUrl });

        if (!recipe) {
          throw new ApolloError(
            RecipeErrors.RECIPE_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        } else if (recipe.author.toString() !== ctx.req.user.id) {
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
        await Comment.deleteMany({ recipe: recipe._id });
        await Recipe.findOneAndDelete({ _id: recipe._id });

        return true;
      } catch (error) {
        throw error;
      }
    },

    updateVoteRecipe: async (_, { recipeUrl, input }, ctx) => {
      const { votes } = input;

      try {
        /* Check if recipe exists */
        const checkRecipe = await Recipe.findOne({ url: recipeUrl });

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
        } else if (checkRecipe.voted.includes(ctx.req.user.id)) {
          throw new ApolloError(
            RecipeErrors.RECIPE_VOTED,
            HttpStatusCode.NOT_ACCEPTABLE
          );
        }

        /* Calculate total votes and save data in DB */
        checkRecipe.votes += votes;
        checkRecipe.voted = [...checkRecipe.voted, ctx.req.user.id];

        const averageVotes = checkRecipe.votes / checkRecipe.voted.length;
        const adjustMean =
          (Math.ceil(averageVotes) + Math.floor(averageVotes)) / 2;

        checkRecipe.average_vote =
          averageVotes < adjustMean ? averageVotes : adjustMean;
        const res = await checkRecipe.save();

        return res;
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
        }

        if (!input.message) {
          throw new ApolloError(
            RecipeErrors.NO_MESSAGE,
            HttpStatusCode.NO_CONTENT
          );
        }

        const newInput = {
          ...input,
          author: ctx.req.user.id,
        };

        const newComment = new Comment(newInput);
        recipe.comments = [...recipe.comments, newComment._id];

        await recipe.save();

        /* Save Data in DB */
        const res = await newComment.save();
        return res;
      } catch (error) {
        throw error;
      }
    },

    editCommentsRecipe: async (_, { id, input }) => {
      try {
        /* Check if comment exists */
        let checkComment = await Comment.findById(id);

        if (!checkComment) {
          throw new ApolloError(
            RecipeErrors.COMMENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }

        /* Edit the comment text and save data in DB */
        checkComment = await Comment.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return checkComment;
      } catch (error) {
        throw error;
      }
    },

    voteCommentsRecipe: async (_, { id, input }, ctx) => {
      try {
        const checkComment = await Comment.findById(id);
        /* Check if comment exists */
        if (!checkComment) {
          throw new ApolloError(
            RecipeErrors.COMMENT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }

        if (!ctx.req.user) {
          throw new ApolloError(
            RecipeErrors.NOT_LOGGED_IN,
            HttpStatusCode.NOT_AUTHORIZED
          );
        } else if (checkComment.voted.includes(ctx.req.user.id)) {
          throw new ApolloError(
            RecipeErrors.COMMENT_VOTED,
            HttpStatusCode.NOT_ACCEPTABLE
          );
        }

        /* Add user who voted and sum votes */
        checkComment.voted = [...checkComment.voted, ctx.req.user.id];
        checkComment.votes += input.votes;
        const res = await checkComment.save();

        return res;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = resolvers;
