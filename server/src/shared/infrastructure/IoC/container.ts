import { createContainer, InjectionMode } from 'awilix';
import commentProvider from '@Shared/infrastructure/IoC/providers/comment.provider';
import recipeProvider from '@Shared/infrastructure/IoC/providers/recipe.provider';
import uploadProvider from '@Shared/infrastructure/IoC/providers/upload.provider';
import userProvider from '@Shared/infrastructure/IoC/providers/user.provider';
import { ICradle } from '@Shared/rest/interfaces/cradle.interface';

const container = createContainer<ICradle>({
  injectionMode: InjectionMode.CLASSIC,
});

commentProvider(container);
recipeProvider(container);
uploadProvider(container);
userProvider(container);

export default container;
