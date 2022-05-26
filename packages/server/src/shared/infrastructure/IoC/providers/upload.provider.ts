import { asClass, AwilixContainer } from 'awilix';
import { UploadRepository } from '@Modules/upload/infrastructure/repository/upload.repository';
import { UploadUserImageUseCase } from '@Modules/upload/application/use-case/upload-user-image.use-case';
import { UploadRecipeImageUseCase } from '@Modules/upload/application/use-case/upload-recipe-image.use-case';
import type { ICradle } from '@Shared/rest/interfaces/cradle.interface';

export interface IUploadProvider {
  uploadUserImageUseCase: UploadUserImageUseCase;
  uploadRecipeImageUseCase: UploadRecipeImageUseCase;
  uploadRepository: UploadRepository;
}

const uploadProvider = (container: AwilixContainer<ICradle>): void => {
  // Register the classes
  container.register({
    uploadUserImageUseCase: asClass(UploadUserImageUseCase),
    uploadRecipeImageUseCase: asClass(UploadRecipeImageUseCase),
    uploadRepository: asClass(UploadRepository),
  });
};

export default uploadProvider;
