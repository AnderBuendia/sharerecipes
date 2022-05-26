import { useQuery, useMutation } from '@apollo/client';
import { FIND_RECIPE, FIND_RECIPES } from '@Lib/graphql/recipe/query.gql';
import {
  CREATE_RECIPE,
  VOTE_RECIPE,
  DELETE_RECIPE,
} from '@Lib/graphql/recipe/mutation.gql';
import type { RecipeService } from '@Interfaces/ports/recipe.interface';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';
import type { QueryDataFindRecipes } from '@Types/apollo/query/recipe.type';

export function useRecipe(): RecipeService {
  const findRecipe = ({
    recipeUrlQuery,
    offset,
    limit,
  }: {
    recipeUrlQuery: string;
    offset: number;
    limit: number;
  }) => {
    return useQuery(FIND_RECIPE, {
      variables: {
        recipeUrlQuery,
        offset,
        limit,
      },
    });
  };

  const findRecipes = ({
    sort,
    query,
    offset,
    limit,
  }: {
    sort: string;
    query?: string;
    offset: number;
    limit: number;
  }) => {
    return useQuery(FIND_RECIPES, {
      variables: { sort, query, offset, limit },
    });
  };

  const setCreateRecipe = () => {
    return useMutation(CREATE_RECIPE, {
      update(cache, { data: { create_recipe } }) {
        const queryData = cache.readQuery<QueryDataFindRecipes>({
          query: FIND_RECIPES,
          variables: { sort: '-createdAt', offset: 0, limit: 20 },
        });

        if (queryData) {
          cache.writeQuery({
            query: FIND_RECIPES,
            variables: { sort: '-createdAt', offset: 0, limit: 20 },
            data: {
              find_recipes: [...queryData.find_recipes, create_recipe],
            },
          });
        }
      },
    });
  };

  const setDeleteRecipe = ({ recipeId }: { recipeId: IRecipe['_id'] }) => {
    return useMutation(DELETE_RECIPE, {
      update(cache) {
        const queryData = cache.readQuery<QueryDataFindRecipes>({
          query: FIND_RECIPES,
          variables: { sort: '-createdAt', offset: 0, limit: 20 },
        });

        if (queryData) {
          cache.writeQuery({
            query: FIND_RECIPES,
            variables: { sort: '-createdAt', offset: 0, limit: 20 },
            data: {
              ...queryData,
              find_recipes: queryData.find_recipes.filter(
                (currentRecipe) => currentRecipe._id !== recipeId
              ),
            },
          });
        }
      },
    });
  };

  const setVoteRecipe = () => {
    return useMutation(VOTE_RECIPE);
  };

  return {
    findRecipe,
    findRecipes,
    setCreateRecipe,
    setDeleteRecipe,
    setVoteRecipe,
  };
}
