import { Router, Request, Response } from 'express';
import container from '@Shared/infrastructure/IoC/container';
import { uploadImageMiddleware } from '@Modules/upload/infrastructure/middleware/upload-image.middleware';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';

const uploadRouter = Router();

uploadRouter.post(
  MainPaths.USER,
  uploadImageMiddleware,
  async (req: Request, res: Response) =>
    container.cradle.uploadUserImageUseCase.execute(req, res)
);

uploadRouter.post(
  MainPaths.RECIPE,
  uploadImageMiddleware,
  async (req: Request, res: Response) =>
    container.cradle.uploadRecipeImageUseCase.execute(req, res)
);

export { uploadRouter };
