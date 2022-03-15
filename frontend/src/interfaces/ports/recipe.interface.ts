import { QueryResult, MutationTuple, OperationVariables } from '@apollo/client';
import { IRecipe } from '@Interfaces/domain/recipe.interface';

export interface RecipeService {
  findRecipe: ({
    recipeUrlQuery,
    offset,
    limit,
  }: {
    recipeUrlQuery: string;
    offset: number;
    limit: number;
  }) => QueryResult<
    any,
    {
      recipeUrlQuery: string;
      offset: number;
      limit: number;
    }
  >;

  findRecipes: ({
    offset,
    limit,
    sort,
  }: {
    offset: number;
    limit: number;
    sort: string;
  }) => QueryResult<
    any,
    {
      offset: number;
      limit: number;
      sort: string;
    }
  >;

  setCreateRecipe: () => MutationTuple<any, OperationVariables>;

  setDeleteRecipe: ({
    recipeId,
  }: {
    recipeId: IRecipe['_id'];
  }) => MutationTuple<any, OperationVariables>;

  setVoteRecipe: () => MutationTuple<any, OperationVariables>;
}
