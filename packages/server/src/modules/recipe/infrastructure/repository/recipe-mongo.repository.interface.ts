import { RecipeModel } from '@Modules/recipe/domain/models/recipe.model';
import { RecipeEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';
import { PublicRecipeDTO } from '@Modules/recipe/infrastructure/graphql/dto/recipe.dto';

export interface RecipeRepositoryInterface {
  toDomain(persistentEntity: RecipeEntity): RecipeModel;

  toDTO(domainEntity: RecipeModel): PublicRecipeDTO;

  toPersistence(domainEntity: RecipeModel): RecipeEntity;

  findRecipeById(recipeId: string): Promise<RecipeModel>;

  findRecipeByUrl(recipeUrl: string): Promise<RecipeModel | undefined>;

  findRecipes(
    sort: string,
    query: string,
    offset: number,
    limit: number
  ): Promise<RecipeModel[]>;

  findRecipesByUserId(userId: string): Promise<RecipeModel[]>;

  findSameRecipes(name: string): Promise<number>;

  createRecipe(recipe: RecipeModel): Promise<void>;

  updateRecipe(recipe: RecipeModel): Promise<void>;

  deleteRecipe(recipe: RecipeModel): Promise<void>;
}
