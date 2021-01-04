const multer = require('multer');
const path = require('path');
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        const fileName = `${shortid.generate()}${path.extname(file.originalname).toLowerCase()}`;
        cb(null, fileName);
    },
});

const uploadImage = multer({ storage }).single('photo');

module.exports = uploadImage;