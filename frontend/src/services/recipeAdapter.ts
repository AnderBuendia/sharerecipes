import { useQuery, useMutation } from '@apollo/client';
import {
  GET_RECIPE,
  GET_RECIPES,
  GET_BEST_RECIPES,
} from '@Lib/graphql/recipe/query';
import {
  NEW_RECIPE,
  VOTE_RECIPE,
  DELETE_RECIPE,
} from '@Lib/graphql/recipe/mutation';
import { RecipeService } from '@Interfaces/ports/recipe.interface';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { QueryDataGetRecipes } from '@Types/apollo/query/recipe.type';

export function useRecipe(): RecipeService {
  const getRecipe = ({
    recipeUrl,
    offset,
    limit,
  }: {
    recipeUrl: string;
    offset: number;
    limit: number;
  }) => {
    return useQuery(GET_RECIPE, {
      variables: {
        recipeUrl,
        offset,
        limit,
      },
    });
  };

  const getRecipes = ({
    offset,
    limit,
    sort,
  }: {
    offset: number;
    limit: number;
    sort: string;
  }) => {
    return useQuery(GET_RECIPES, {
      variables: { offset, limit, sort },
    });
  };

  const getBestRecipes = ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => {
    return useQuery(GET_BEST_RECIPES, {
      variables: { offset, limit },
    });
  };

  const setNewRecipe = () => {
    return useMutation(NEW_RECIPE, {
      update(cache, { data: { newRecipe } }) {
        const queryData = cache.readQuery<QueryDataGetRecipes>({
          query: GET_RECIPES,
          variables: { offset: 0, limit: 20, sort: '-createdAt' },
        });

        if (queryData) {
          cache.writeQuery({
            query: GET_RECIPES,
            variables: { offset: 0, limit: 20, sort: '-createdAt' },
            data: {
              ...queryData,
              getRecipes: [...queryData.getRecipes, newRecipe],
            },
          });
        }
      },
    });
  };

  const setDeleteRecipe = ({ recipeId }: { recipeId: IRecipe['_id'] }) => {
    return useMutation(DELETE_RECIPE, {
      update(cache) {
        const queryData = cache.readQuery<QueryDataGetRecipes>({
          query: GET_RECIPES,
          variables: { offset: 0, limit: 20, sort: '-createdAt' },
        });

        if (queryData) {
          cache.writeQuery({
            query: GET_RECIPES,
            variables: { offset: 0, limit: 20, sort: '-createdAt' },
            data: {
              ...queryData,
              getRecipes: queryData.getRecipes.filter(
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
    getRecipe,
    getRecipes,
    getBestRecipes,
    setNewRecipe,
    setDeleteRecipe,
    setVoteRecipe,
  };
}
