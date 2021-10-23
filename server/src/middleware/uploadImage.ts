import multer from 'multer';
import path from 'path';
import shortid from 'shortid';

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), '/images'),
  filename: (req, file, cb) => {
    const fileName = `${shortid.generate()}${path
      .extname(file.originalname)
      .toLowerCase()}`;
    cb(null, fileName);
  },
});

const uploadImage = multer({ storage }).single('photo');

export default uploadImage;
