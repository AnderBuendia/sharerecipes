import { asClass, AwilixContainer } from 'awilix';
import { RecipeRepository } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository';
import { ICradle } from '@Shared/rest/interfaces/cradle.interface';
import { FindRecipeByUrlQuery } from '@Modules/recipe/application/queries/find-recipe-by-url.query';
import { FindRecipesByUserIdQuery } from '@Modules/recipe/application/queries/find-recipes-by-user-id.query';
import { FindRecipesQuery } from '@Modules/recipe/application/queries/find-recipes.query';
import { CreateRecipeUseCase } from '@Modules/recipe/application/use-case/create-recipe.use-case';
import { DeleteRecipeUseCase } from '@Modules/recipe/application/use-case/delete-recipe.use-case';
import { VoteRecipeUseCase } from '@Modules/recipe/application/use-case/vote-recipe.use-case';

export interface IRecipeProvider {
  recipeRepository: RecipeRepository;
  findRecipeByUrlQuery: FindRecipeByUrlQuery;
  findRecipesQuery: FindRecipesQuery;
  findRecipesByUserIdQuery: FindRecipesByUserIdQuery;
  createRecipeUseCase: CreateRecipeUseCase;
  deleteRecipeUseCase: DeleteRecipeUseCase;
  voteRecipeUseCase: VoteRecipeUseCase;
}

const recipeProvider = (container: AwilixContainer<ICradle>): void => {
  // Register the classes
  container.register({
    findRecipesByUserIdQuery: asClass(FindRecipesByUserIdQuery),
    voteRecipeUseCase: asClass(VoteRecipeUseCase),
    deleteRecipeUseCase: asClass(DeleteRecipeUseCase),
    createRecipeUseCase: asClass(CreateRecipeUseCase),
    findRecipesQuery: asClass(FindRecipesQuery),
    findRecipeByUrlQuery: asClass(FindRecipeByUrlQuery),
    recipeRepository: asClass(RecipeRepository),
  });
};

export default recipeProvider;
