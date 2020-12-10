const User = require('../../models/User');
const Recipes = require('../../models/Recipes');
const Comments = require('../../models/Comments');

const resolvers = {
    /* Types to relation DBs */
    Recipe: {
        author: async ({author}) => {
            const user = await User.findById(author);
            return user;
        },
        comments: async ({id}, {offset, limit}) => {
            const comments = await Comments.find({ recipe: id }).skip(offset).limit(limit).exec();
            return comments;
            
        }
    },

    CommentsRecipe: {
        author: async ({author}) => {
            const user = await User.findById(author);
            return user;
        },
        recipe: async ({recipe}) => {
            return await Recipes.findById(recipe);
        }
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
                const recipes = await Recipes.find({});
                return recipes;
            } catch (error) {
                console.log(error);
            }
        },

        /* Comments Recipe */
        getCommentRecipe: async (_, {id}) => {
            /* Check if recipe exists */
            const comment = await Comments.findById(id);
            if (!comment) {
                throw new Error('Comment did not found');
            }

            return comment;
        },
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
            const checkRecipe = await Recipes.findById(id);

            if (!checkRecipe) {
                throw new Error('Recipe does not exist');
            }

            /* Check if the author is the one who deletes the order */
            if (checkRecipe.author.toString() !== ctx.req.user.id) {
                throw new Error('Invalid credentials');
            }

            /* Delete data from DB */
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
        sendCommentsRecipe: async (_, {input}, ctx) => {
            const newComment = new Comments(input);

            /* Assign user and recipe */
            newComment.author = ctx.req.user.id;

            /* Save Data in DB */
            try {
                const res = await newComment.save();
                return res;
            } catch (error) {
                console.log(error);
            }
        },

        voteCommentsRecipe: async (_, {id, input}, ctx) => {
            /* Check if comment exists */
            const checkComment = await Comments.findById(id);

            if (!checkComment) {
                throw new Error('Comment does not exist');
            }

            /* Check if user has voted */
            if (checkComment.voted.includes(ctx.req.user.id)) {
                throw new Error('You has voted this recipe');
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