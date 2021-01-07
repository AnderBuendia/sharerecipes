const User = require('../../models/User');
const Recipes = require('../../models/Recipes');
const Comments = require('../../models/Comments');

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
            const recipeComments = await Comments.find({ _id: { $in: comments } }).skip(offset).limit(limit).exec();
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
        getRecipe: async (_, {id}) => {
            /* Check if recipe exists */
            const recipe = await Recipes.findById(id);
            if (!recipe) {
                throw new Error('Recipe did not found');
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
        getNumberOfComments: async (_, {id}) => {
            /* Check recipe */
            let recipe = await Recipes.findById(id);

            if (!recipe) {
                throw new Error('Recipe does not exist');
            }

            /* Get comments from this recipe */
            const comments = await Comments.find({ _id: { $in: recipe.comments } });

            return comments;
        }
    },

    Mutation: {
        newRecipe: async (_, {input}, ctx) => {
            // console.log(ctx.req);
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

        deleteRecipe: async (_, {id}, ctx) => {
            /* Check if recipe exists */
            const recipe = await Recipes.findById(id);

            if (!recipe) {
                throw new Error('Recipe does not exist');
            }

            /* Check if the author is the one who deletes the order */
            if (recipe.author.toString() !== ctx.req.user.id) {
                throw new Error('Invalid credentials');
            }

            /* Delete recipe image from server */
            const pathName = path.join(__dirname, `../../images/${recipe.image_name}`);
            fs.unlinkSync(pathName);

            /* Delete data from DB */
            await Comments.deleteMany({ recipe: id });
            await Recipes.findOneAndDelete({ _id: id });
            return 'Recipe has been deleted';
        },

        updateVoteRecipe: async (_, {id, input}, ctx) => {
            const { votes } = input;

            /* Check if recipe exists */
            const checkRecipe = await Recipes.findById(id);

            if (!checkRecipe) {
                throw new Error('Recipe does not exist');
            }

            /* Check if user has voted */
            if (checkRecipe.voted.includes(ctx.req.user.id)) {
                throw new Error('You has voted this recipe');
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
        sendCommentsRecipe: async (_, {id, input}, ctx) => {
            
            /* Check errors */
            let recipe = await Recipes.findById(id);
            if (!recipe) {
                throw new Error('Recipe does not exist');
            }

            if (!input.message) {
                throw new Error('Please introduce your message');
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
                throw new Error('Comment does not exist');
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
                throw new Error('Comment does not exist');
            }

            /* Check if user has voted */
            if (checkComment.voted.includes(ctx.req.user.id)) {
                throw new Error('You has voted this comment');
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