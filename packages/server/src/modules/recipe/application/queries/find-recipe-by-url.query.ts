import { ApolloError } from 'apollo-server-express';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import { RecipeErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class FindRecipeByUrlQuery {
  constructor(private readonly recipeRepository: RecipeRepositoryInterface) {}

  async execute(recipeUrlQuery: string) {
    try {
      const existingRecipe = await this.recipeRepository.findRecipeByUrl(
        recipeUrlQuery
      );

      if (!existingRecipe)
        throw new ApolloError(
          RecipeErrors.RECIPE_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );

      const recipe = this.recipeRepository.toDTO(existingRecipe);

      return recipe;
    } catch (error) {
      throw error;
    }
  }
}
