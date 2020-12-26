const { createWriteStream } = require('fs');
const path = require('path');
const shortid = require('shortid');

const createUrlImage = async (file) => {
    const { createReadStream, filename } = await file;
    
    /* if mimetype !== jpeg or jpg or png err */
    const { ext } = path.parse(filename);
    const randomName = shortid.generate()+ext;

    const stream = createReadStream();
    const pathName = path.join(__dirname, `../../images/${randomName}`);
    await stream.pipe(createWriteStream(pathName));

    return { 
        url: `http://localhost:4000/images/${randomName}`, 
        fileName: randomName 
    };
}

const resolvers = {
    Mutation: {
        /* Files */
        uploadRecipeImage: async (_, {file}) => {    
            return createUrlImage(file);
        },

        uploadUserImage: async (_, {file}) => {
            return createUrlImage(file);
        },
    },
};

module.exports = resolvers;