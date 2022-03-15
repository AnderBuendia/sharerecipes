import { ApolloError } from 'apollo-server-express';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import {
  CommonErrors,
  RecipeErrors,
  UserErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class DeleteRecipeUseCase {
  constructor(
    private recipeRepository: RecipeRepositoryInterface,
    private commentRepository: CommentRepositoryInterface
  ) {}

  async execute(recipeId: string, ctxUserId?: string) {
    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const existingRecipe = await this.recipeRepository.findRecipeById(
        recipeId
      );

      if (!existingRecipe) {
        throw new ApolloError(
          RecipeErrors.RECIPE_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      } else if (existingRecipe.author.value !== ctxUserId) {
        throw new ApolloError(
          CommonErrors.INVALID_CREDENTIALS,
          HTTPStatusCodes.NOT_AUTHORIZED
        );
      }

      await this.recipeRepository.deleteRecipe(existingRecipe);

      await this.commentRepository.deleteRecipeComments(existingRecipe);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}
