import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import {
  GET_RECIPES,
  GET_BEST_RECIPES,
  GET_RECIPE,
} from '@Lib/graphql/recipe/query';
import { NEW_RECIPE, VOTE_RECIPE } from '@Lib/graphql/recipe/mutation';

export default function useRecipes() {
  const { addToast } = useToasts();

  /* Apollo Mutations */
  const [voteRecipe] = useMutation(VOTE_RECIPE);
  const [newRecipe] = useMutation(NEW_RECIPE, {
    update(cache, { data: { newRecipe } }) {
      const queryData = cache.readQuery({
        query: GET_RECIPES,
        variables: { offset: 0, limit: 20 },
      });

      cache.writeQuery({
        query: GET_RECIPES,
        variables: { offset: 0, limit: 20 },
        data: {
          ...queryData,
          getRecipes: [...queryData.getRecipes, newRecipe],
        },
      });
    },
  });

  const getRecipes = useCallback(({ offset, limit }) => {
    return useQuery(GET_RECIPES, {
      variables: { offset, limit },
    });
  }, []);

  const getBestRecipes = useCallback(({ offset, limit }) => {
    return useQuery(GET_BEST_RECIPES, {
      variables: { offset, limit },
    });
  }, []);

  const getRecipe = useCallback(({ recipeUrl, offset, limit }) => {
    return useQuery(GET_RECIPE, {
      variables: {
        recipeUrl,
        offset,
        limit,
      },
    });
  }, []);

  const setNewRecipe = useCallback(async ({ submitData, recipeImage }) => {
    console.log('SUBMIT DATA', submitData);
    const {
      name,
      prep_time,
      serves,
      ingredients,
      description,
      difficulty,
      style,
      other_style,
    } = submitData;

    try {
      const { data } = await newRecipe({
        variables: {
          input: {
            name,
            prep_time: parseInt(prep_time),
            serves: parseInt(serves),
            ingredients,
            difficulty: difficulty.value,
            style: other_style ? other_style : style.value,
            image_url: recipeImage.image_url,
            image_name: recipeImage.filename,
            description,
          },
        },
      });

      return data;
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setVoteRecipe = useCallback(async ({ url, votes }) => {
    try {
      await voteRecipe({
        variables: {
          recipeUrl: url,
          input: {
            votes,
          },
        },
      });
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  return {
    getRecipes,
    getBestRecipes,
    getRecipe,
    setNewRecipe,
    setVoteRecipe,
  };
}
