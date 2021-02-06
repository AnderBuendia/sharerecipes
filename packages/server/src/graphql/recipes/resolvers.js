const User = require('../../models/User');
const Recipes = require('../../models/Recipes');
const Comments = require('../../models/Comments');

const { ApolloError } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');

const resolvers = {
    /* Types to relation DBs */
    Recipe: {
        author: async ({author}) => {
            const user = await User.findById(author);
            return user;
        },
        comments: async ({comments}, {offset, limit}) => {
            const recipeComments = await Comments.find({ _id: { $in: comments } }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
            return recipeComments;
            
        }
    },

    CommentsRecipe: {
        author: async ({author}) => {
            const user = await User.findById(author);
            return user;
        },
    },

    Query: {
        getRecipe: async (_, {recipeUrl}) => {
            /* Check if recipe exists */
            const recipe = await Recipes.findOne({url: recipeUrl});

            if (!recipe) {
                throw new ApolloError('Recipe not found', 401);
            }

            return recipe;
        },

        getRecipes: async () => {
            try {
                const recipes = await Recipes.find({}).sort({ createdAt: -1 });
                return recipes;
            } catch (error) {
                console.log(error);
            }
        },

        getBestRecipes: async () => {
            try {
                const recipes = await Recipes.find({}).sort({ average_vote: -1 });
                return recipes;
            } catch (error) {
                console.log(error);
            }
        },

        /* Recipe comments */
        getNumberOfComments: async (_, {recipeUrl}) => {
            /* Check recipe */
            let recipe = await Recipes.findOne({ url: recipeUrl });

            if (!recipe) {
                throw new ApolloError('Recipe not found', 404);
            }

            /* Get comments from this recipe */
            const comments = await Comments.find({ _id: { $in: recipe.comments } });

            return comments;
        }
    },

    Mutation: {
        newRecipe: async (_, {input}, ctx) => {
            // console.log(ctx.req);
   
            const urlName = input.name.replace(' ', '-').toLowerCase();

            const recipes = await 
                Recipes.countDocuments({ name: input.name }).collation({ locale: 'en', strength: 2 });
                                        
            if (recipes > 0) {
                input.url = `${urlName}-${recipes}`;
            } else {
                input.url = urlName;
            }

            const newRecipe = new Recipes(input);

            /* Assign the user creator */
            newRecipe.author = ctx.req.user.id;

            /* Save data in DB */
            try {
                const res = await newRecipe.save();
                return res;
            } catch (error) {
                console.log(error);
            }
        },

        deleteRecipe: async (_, {recipeUrl}, ctx) => {
            /* Check if recipe exists */
            const recipe = await Recipes.findOne({ url: recipeUrl });

            if (!recipe) {
                throw new ApolloError('Recipe not found', 404);
            }

            /* Check if the author is the one who deletes the order */
            if (recipe.author.toString() !== ctx.req.user.id) {
                throw new ApolloError('Invalid credentials', 401);
            }

            /* Delete recipe image from server */
            const pathName = path.join(__dirname, `../../images/${recipe.image_name}`);
            fs.unlinkSync(pathName);

            /* Delete data from DB */
            // TODO: revisar los comentarios para eliminar de la receta
            await Comments.deleteMany({ recipe: recipe._id });
            await Recipes.findOneAndDelete({ _id: recipe._id });
            return true;
        },

        updateVoteRecipe: async (_, {recipeUrl, input}, ctx) => {
            const { votes } = input;

            /* Check if recipe exists */
            const checkRecipe = await Recipes.findOne({ url: recipeUrl });

            if (!checkRecipe) {
                throw new ApolloError('Recipe not found', 404);
            }

            /* Check if user has voted */
            if (checkRecipe.voted.includes(ctx.req.user.id)) {
                throw new ApolloError('You has voted this recipe', 406);
            }
            
            /* Calculate total votes and save data in DB */
            checkRecipe.votes += votes;
            checkRecipe.voted = [...checkRecipe.voted, ctx.req.user.id];

            const averageVotes = (checkRecipe.votes/checkRecipe.voted.length);
            const adjustMean = ((Math.ceil(averageVotes)+Math.floor(averageVotes))/2);

            checkRecipe.average_vote = (averageVotes < adjustMean ? averageVotes : adjustMean); 
            const res = await checkRecipe.save();
            
            return res;
        },

        /* Comments Recipe */
        sendCommentsRecipe: async (_, {recipeUrl, input}, ctx) => {
            /* Check errors */
            let recipe = await Recipes.findOne({ url: recipeUrl });

            if (!recipe) {
                throw new ApolloError('Recipe not found', 404);
            }

            if (!input.message) {
                throw new ApolloError('Please introduce your message', 204);
            }

            const newComment = new Comments(input);
            
            /* Assign user and recipe */
            newComment.author = ctx.req.user.id;
            
            recipe.comments = [...recipe.comments, newComment._id];
            await recipe.save();

            /* Save Data in DB */
            try {
                const res = await newComment.save();
                return res;
            } catch (error) {
                console.log(error);
            }
        },

        editCommentsRecipe: async (_, {id, input}) => {
            /* Check if comment exists */
            let checkComment = await Comments.findById(id);

            if (!checkComment) {
                throw new ApolloError('Comment not found', 404);
            }

            /* Edit the comment text and save data in DB */
            checkComment = await Comments.findOneAndUpdate({ _id: id}, input, {
                new: true
            });

            return checkComment;
        },

        voteCommentsRecipe: async (_, {id, input}, ctx) => {
            /* Check if comment exists */
            const checkComment = await Comments.findById(id);

            if (!checkComment) {
                throw new ApolloError('Comment not found', 404);
            }

            if (!ctx.req.user) {
                 throw new ApolloError('You are not logged in', 401);
            } else if (checkComment.voted.includes(ctx.req.user.id)) {
                throw new ApolloError('You has voted this comment', 406);
            }
           
            /* Add user who voted and sum votes */
            checkComment.voted = [...checkComment.voted, ctx.req.user.id];
            checkComment.votes += input.votes;
            const res = await checkComment.save();

            return res;
        },
    },
};

module.exports = resolvers;