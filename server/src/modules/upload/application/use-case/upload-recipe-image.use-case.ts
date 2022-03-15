import type { Request, Response } from 'express';
import { TOKEN_CODE, API_URL } from '@Shared/utils/constants';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { UploadRepositoryInterface } from '@Modules/upload/infrastructure/repository/upload.repository.interface';
import { MainPaths } from '@Shared/infrastructure/enums/paths/main-paths.enum';
import {
  CommonErrors,
  UploadErrors,
  UserErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

const IMAGES_API_URL = `${API_URL}${MainPaths.IMAGES}`;

export class UploadRecipeImageUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private uploadRepository: UploadRepositoryInterface
  ) {}

  async execute(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error(UploadErrors.FILE_NOT_FOUND);

      const authorization = req.headers['authorization'];
      const { filename } = req.file;
      const imageUrl = `${IMAGES_API_URL}/${filename}`;

      if (!authorization) {
        this.uploadRepository.deleteImageFile(imageUrl);
        throw new Error(CommonErrors.TOKEN_NOT_FOUND);
      }

      const token = authorization.split(' ')[1];

      const verifiedUser = this.userRepository.verifyToken(token, TOKEN_CODE);
      const existingUser = await this.userRepository.findUserById(verifiedUser);

      if (!existingUser) {
        this.uploadRepository.deleteImageFile(imageUrl);
        throw new Error(UserErrors.REGISTERED);
      }

      return res
        .status(Number(HTTPStatusCodes.OK))
        .json({ image_url: imageUrl, image_name: filename });
    } catch (error) {
      res
        .status(Number(HTTPStatusCodes.INTERNAL_SERVER_ERROR))
        .send({ message: error.message });
    }
  }
}
