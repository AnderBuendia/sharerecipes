import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { GET_RECIPES } from '@Lib/graphql/recipe/query';
import { DELETE_RECIPE } from '@Lib/graphql/recipe/mutation';

export default function useDeleteRecipe({ _id }) {
  const { addToast } = useToasts();
  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    update(cache) {
      const queryData = cache.readQuery({
        query: GET_RECIPES,
        variables: { offset: 0, limit: 20 },
      });

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
    },
  });

  const setDeleteRecipe = useCallback(async ({ _id }) => {
    try {
      const { data } = await deleteRecipe({
        variables: {
          _id,
        },
      });

      return data;
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  return { setDeleteRecipe };
}
