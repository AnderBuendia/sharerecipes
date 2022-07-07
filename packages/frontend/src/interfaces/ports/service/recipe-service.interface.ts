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
    sort,
    query,
    offset,
    limit,
  }: {
    sort: string;
    query?: string;
    offset: number;
    limit: number;
  }) => QueryResult<
    any,
    {
      sort: string;
      query: string | undefined;
      offset: number;
      limit: number;
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
