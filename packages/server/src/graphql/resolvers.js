const User = require('../models/User');
const Recipes = require('../models/Recipes');

const { createWriteStream, rename } = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const multer = require('multer');
require('dotenv').config({ path: 'src/config/variables.env' });

/* Other fns */
const files = [];

const createToken = (user, secret, expiresIn) => {
    // console.log('TOKENUSER', user);
    const { id } = user;

    return jwt.sign({ id }, secret, { expiresIn });
};

/* Resolvers */
const resolvers = {
    Query: {
        /* Users */
        getUser: async (_, {}, ctx) => {
            if (ctx.req.user) {
                const user = await User.findById(ctx.req.user.id);
                return user;
            } else {
                return null;
            }
        },

        getUsers: async () => {
            try {
                const users = await User.find({});

                return users;
            } catch (error) {
                console.log(error);
            }
        },

        /* Recipes */
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
  
    },
    Mutation: {
        /* Users */
        newUser: async (_, {input}) => {
            //console.log(input);
            const { email, password } = input;

            /* Check if user is already registered */
            let user = await User.findOne({ email });

            if (user) {
                throw new Error('User is already registered'); 
            }

            /* Hashing password */
            const salt = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);

            try {
                user = new User(input);
                await user.save();
                return user;      
            } catch (error) {
                console.log(error);
            }
        },

        authenticateUser: async (_, {input}) => {
            const { email, password } = input;

            /* Check if user is exists */
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('User does not exist'); 
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
            
            if (!checkPassword) {
                throw new Error('Password is wrong');
            }

            /* Create JWT */
            return {
                token: createToken(user, process.env.SECRET_JWT, '16h')
            }
        },

        updateUser: async (_, {id, input}, ctx) => {
            /* Check if user exists */
            let user = await User.findById(id);

            if (!user) {
                throw new Error('User does not exist');
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new Error('Invalid credentials');
            }

            /* Save data in DB */
            user = await User.findOneAndUpdate({ _id: id}, input, {
                new: true
            });

            return user;
        },

        updateUserPassword: async (_, {id, input}, ctx) => {
            console.log('ID ', id);
            console.log('INPUT ', input);
            const { password, confirmpassword } = input;

            /* Check if user exists */
            let user = await User.findById(id);

            if (!user) {
                throw new Error('User does not exist');
            }

            /* Check if user is the editor */
            if (user.id !== ctx.req.user.id) {
                throw new Error('Invalid credentials');
            }

            /* Check if password is correct */
            const checkPassword = await bcrypt.compare(password, user.password);
        
            if (!checkPassword) {
                throw new Error('Your current password is wrong');
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
                throw new Error('User does not exist');
            }

            /* Check if the admin is the one who deletes the user */
            const adminUser = await User.findById(ctx.req.user.id);
            console.log('ADMINUSER', adminUser);

            if (adminUser.role !== 'Admin') {
                throw new Error('Invalid credentials');
            }

            /* Delete data from DB */
            await User.findOneAndDelete({ _id: id });
            return 'User has been deleted';
        },

        /* Recipes */
        newRecipe: async (_, {input}, ctx) => {
            // console.log(ctx.req);
            const newRecipe = new Recipes(input);

            //console.log(newRecipe);

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

        updateCommentsRecipe: async (_, {id, input}) => {
            /* Check if recipe exists */
            const checkRecipe = await Recipes.findById(id);

            if (!checkRecipe) {
                throw new Error('Recipe does not exist');
            }

            const { user_id, user_name, message } = input.comments;

            checkRecipe.comments = [...checkRecipe.comments, {
                user_id, user_name, message
            }];

            checkRecipe.save();
            return checkRecipe;
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

        /* Files */
        uploadImageRecipe: async (_, {file}) => {
            const { createReadStream, filename } = await file;
            
            /* if mimetype !=== jpeg or jpg or png err */
            const { ext } = path.parse(filename);
            const randomName = shortid.generate()+ext;

            const stream = createReadStream();
            const pathName = path.join(__dirname, `../../images/recipe/${randomName}`);
            
            await stream.pipe(createWriteStream(pathName));

            return { 
                url : `http://localhost:4000/images/recipe/${randomName}`, 
                fileName: randomName 
            };

        },

        uploadImageUser: async (_, {file}) => {
            const { createReadStream, filename } = await file;
            
            /* if mimetype !=== jpeg or jpg or png err */
            const { ext } = path.parse(filename);
            const randomName = shortid.generate()+ext;

            const stream = createReadStream();
            const pathName = path.join(__dirname, `../../images/user/${randomName}`);
            
            await stream.pipe(createWriteStream(pathName));

            return { 
                url : `http://localhost:4000/images/user/${randomName}`, 
                fileName: randomName 
            };

        },
    }
};

module.exports = resolvers;