import express from 'express';
import { uploadRouter } from '@Modules/upload/infrastructure/routes/upload.routes';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';
import { IMAGES_PATH } from '@Shared/utils/constants';

const v1Router = express.Router();

v1Router.use(MainPaths.UPLOAD, uploadRouter);
v1Router.use(MainPaths.IMAGES, express.static(IMAGES_PATH));

export { v1Router };
