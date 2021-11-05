import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import {
  GET_RECIPES,
  GET_BEST_RECIPES,
  GET_RECIPE,
} from '@Lib/graphql/recipe/query';
import { NEW_RECIPE, VOTE_RECIPE } from '@Lib/graphql/recipe/mutation';
import { QueryDataGetRecipes } from '@Types/apollo/query/recipe.type';
import {
  RecipeImage,
  NewRecipeData,
} from '@Interfaces/domain/recipe.interface';

export default function useRecipes() {
  const { addToast } = useToasts();

  /* Apollo Mutations */
  const [voteRecipe] = useMutation(VOTE_RECIPE);
  const [newRecipe] = useMutation(NEW_RECIPE, {
    update(cache, { data: { newRecipe } }) {
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
            getRecipes: [...queryData.getRecipes, newRecipe],
          },
        });
      }
    },
  });

  const getRecipes = useCallback(
    ({ offset, limit }: { offset: number; limit: number }) => {
      return useQuery(GET_RECIPES, {
        variables: { offset, limit },
      });
    },
    [useQuery]
  );

  const getBestRecipes = useCallback(
    ({ offset, limit }: { offset: number; limit: number }) => {
      return useQuery(GET_BEST_RECIPES, {
        variables: { offset, limit },
      });
    },
    [useQuery]
  );

  const getRecipe = useCallback(
    ({
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
    },
    [useQuery]
  );

  const setNewRecipe = useCallback(
    async ({
      submitData,
      recipeImage,
    }: {
      submitData: NewRecipeData;
      recipeImage?: RecipeImage;
    }) => {
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
        if (!recipeImage) {
          throw new Error('There is no image. Please upload an image.');
        }

        const { data } = await newRecipe({
          variables: {
            input: {
              name,
              prep_time: Number(prep_time),
              serves: Number(serves),
              ingredients,
              difficulty,
              style: other_style ? other_style : style,
              image_url: recipeImage.image_url,
              image_name: recipeImage.image_name,
              description,
            },
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
    },
    [newRecipe]
  );

  const setVoteRecipe = useCallback(
    async ({ url, votes }: { url: string; votes: number }) => {
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
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [voteRecipe]
  );

  return {
    getRecipes,
    getBestRecipes,
    getRecipe,
    setNewRecipe,
    setVoteRecipe,
  };
}
