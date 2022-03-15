import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';

const MULTER_OBJECT = 'photo';

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), MainPaths.IMAGES),

  filename: (_, file, cb) => {
    const fileName = `${uuidv4()}${path
      .extname(file.originalname)
      .toLowerCase()}`;

    cb(null, fileName);
  },
});

const uploadImageMiddleware = multer({ storage }).single(MULTER_OBJECT);

export { uploadImageMiddleware };
