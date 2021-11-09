import { QueryResult, MutationTuple, OperationVariables } from '@apollo/client';
import { IRecipe } from '@Interfaces/domain/recipe.interface';

export interface RecipeService {
  getRecipe: ({
    recipeUrl,
    offset,
    limit,
  }: {
    recipeUrl: string;
    offset: number;
    limit: number;
  }) => QueryResult<
    any,
    {
      recipeUrl: string;
      offset: number;
      limit: number;
    }
  >;

  getRecipes: ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => QueryResult<
    any,
    {
      offset: number;
      limit: number;
    }
  >;

  getBestRecipes: ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => QueryResult<
    any,
    {
      offset: number;
      limit: number;
    }
  >;

  setNewRecipe: () => MutationTuple<any, OperationVariables>;
  setDeleteRecipe: ({
    recipeId,
  }: {
    recipeId: IRecipe['_id'];
  }) => MutationTuple<any, OperationVariables>;
  setVoteRecipe: () => MutationTuple<any, OperationVariables>;
}
