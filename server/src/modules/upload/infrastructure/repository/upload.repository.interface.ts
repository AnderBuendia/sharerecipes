import type { UserModel } from '@Modules/user/domain/models/user.model';

export interface UploadRepositoryInterface {
  deleteCurrentUserImageFile(user: UserModel): void;

  deleteImageFile(imageUrl: string): void;
}
