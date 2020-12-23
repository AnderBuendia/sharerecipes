const { createWriteStream } = require('fs');
const path = require('path');
const shortid = require('shortid');

const resolvers = {
    Mutation: {
        /* Files */
        uploadRecipeImage: async (_, {file}) => {
            const { createReadStream, filename } = await file;
            
            /* if mimetype !== jpeg or jpg or png err */
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

        uploadUserImage: async (_, {file}) => {
            const { createReadStream, filename } = await file;
            
            /* if mimetype !=== jpeg or jpg or png err */
            const { ext } = path.parse(filename);
            const randomName = shortid.generate()+ext;

            const stream = createReadStream();
            const pathName = path.join(__dirname, `../../images/user/${randomName}`);
            
            await stream.pipe(createWriteStream(pathName));

            return { 
                url: `http://localhost:4000/images/user/${randomName}`, 
                fileName: randomName 
            };

        },
    },
};

module.exports = resolvers;