import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { GET_RECIPES } from '@Lib/graphql/recipe/query';
import { DELETE_RECIPE } from '@Lib/graphql/recipe/mutation';
import { QueryDataGetRecipes } from '@Types/apollo/query/recipe.type';

export default function useDeleteRecipe({ _id }: { _id: string }) {
  const { addToast } = useToasts();
  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    update(cache) {
      const queryData = cache.readQuery<QueryDataGetRecipes>({
        query: GET_RECIPES,
        variables: { offset: 0, limit: 20 },
      });

      if (queryData) {
        cache.writeQuery({
          query: GET_RECIPES,
          variables: { offset: 0, limit: 20 },
          data: {
            ...queryData,
            getRecipes: queryData.getRecipes.filter(
              (currentRecipe) => currentRecipe._id !== _id
            ),
          },
        });
      }
    },
  });

  const setDeleteRecipe = useCallback(async ({ _id }: { _id: string }) => {
    try {
      const { data } = await deleteRecipe({
        variables: {
          _id,
        },
      });

      return data;
    } catch (error) {
      if (error instanceof Error) {
        addToast(error.message.replace('GraphQL error: ', ''), {
          appearance: 'error',
        });
      }
    }
  }, []);

  return { setDeleteRecipe };
}
