import { ApolloError } from 'apollo-server-express';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import { RecipeErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class FindRecipesByUserIdQuery {
  constructor(private readonly recipeRepository: RecipeRepositoryInterface) {}

  async execute(userId: string) {
    try {
      const existingRecipes = await this.recipeRepository.findRecipesByUserId(
        userId
      );

      if (!existingRecipes)
        throw new ApolloError(
          RecipeErrors.RECIPES_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );

      const recipes = existingRecipes.map((existingRecipe) =>
        this.recipeRepository.toDTO(existingRecipe)
      );

      return recipes;
    } catch (error) {
      throw error;
    }
  }
}
