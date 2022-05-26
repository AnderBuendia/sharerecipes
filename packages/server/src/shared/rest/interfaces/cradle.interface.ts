import { IUserProvider } from '@Shared/infrastructure/IoC/providers/user.provider';
import { IRecipeProvider } from '@Shared/infrastructure/IoC/providers/recipe.provider';
import { IUploadProvider } from '@Shared/infrastructure/IoC/providers/upload.provider';
import { ICommentProvider } from '@Shared/infrastructure/IoC/providers/comment.provider';

export interface ICradle
  extends IUserProvider,
    IRecipeProvider,
    IUploadProvider,
    ICommentProvider {}
