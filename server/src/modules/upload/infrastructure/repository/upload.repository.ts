import { unlinkSync } from 'fs';
import { IMAGES_PATH } from '@Shared/utils/constants';
import type { UserModel } from '@Modules/user/domain/models/user.model';
import type { UploadRepositoryInterface } from '@Modules/upload/infrastructure/repository/upload.repository.interface';

export class UploadRepository implements UploadRepositoryInterface {
  deleteCurrentUserImageFile(user: UserModel) {
    const pathName = `${IMAGES_PATH}/${user.imageName}`;

    if (user.imageName) unlinkSync(pathName);
  }

  deleteImageFile(imageUrl: string) {
    unlinkSync(imageUrl);
  }
}
