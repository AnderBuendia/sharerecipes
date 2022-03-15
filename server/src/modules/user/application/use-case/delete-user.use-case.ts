import { ApolloError } from 'apollo-server-express';
import type { UserRepositoryInterface } from '@Modules/user/infrastructure/repository/user-mongo.repository.interface';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import type { DeleteUserDTO } from '@Modules/user/infrastructure/graphql/dto/user.dto';
import {
  CommonErrors,
  UserErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';
import { UserRole } from '@Shared/domain/enums/user-role.enum';

export class DeleteUserUseCase {
  constructor(
    private recipeRepository: RecipeRepositoryInterface,
    private commentRepository: CommentRepositoryInterface,
    private userRepository: UserRepositoryInterface
  ) {}

  async execute(input: DeleteUserDTO, ctxUserId?: string) {
    const { email } = input;

    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const user = await this.userRepository.findUserByEmail(email);
      const contextUser = await this.userRepository.findUserById(ctxUserId);

      if (!user || !contextUser) {
        throw new ApolloError(
          UserErrors.USER_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      } else if (contextUser.role !== UserRole.ADMIN) {
        return new ApolloError(
          CommonErrors.INVALID_CREDENTIALS,
          HTTPStatusCodes.NOT_AUTHORIZED
        );
      }

      const userRecipes = await this.recipeRepository.findRecipesByUserId(
        user._id.value
      );

      userRecipes.forEach(async (userRecipe) => {
        await this.commentRepository.deleteRecipeComments(userRecipe);

        await this.recipeRepository.deleteRecipe(userRecipe);
      });

      await this.userRepository.deleteUser(user);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}
