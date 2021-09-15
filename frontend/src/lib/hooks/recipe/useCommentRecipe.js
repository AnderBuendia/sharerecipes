import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { GET_RECIPE } from '@Lib/graphql/recipe/query';
import {
  EDIT_COMMENT_RECIPE,
  VOTE_COMMENT_RECIPE,
  SEND_COMMENT_RECIPE,
} from '@Lib/graphql/comment/mutation';

export default function useCommentRecipe({ url }) {
  const { addToast } = useToasts();

  const [editCommentRecipe] = useMutation(EDIT_COMMENT_RECIPE);
  const [voteCommentRecipe] = useMutation(VOTE_COMMENT_RECIPE);

  const [sendCommentRecipe] = useMutation(SEND_COMMENT_RECIPE, {
    update(cache, { data: { sendCommentRecipe } }) {
      const data = cache.readQuery({
        query: GET_RECIPE,
        variables: {
          recipeUrl: url,
          offset: 0,
          limit: 10,
        },
      });

      cache.writeQuery({
        query: GET_RECIPE,
        variables: {
          recipeUrl: url,
          offset: 0,
          limit: 10,
        },
        data: {
          ...data,
          getRecipe: {
            comments: [...data.getRecipe.comments, sendCommentRecipe],
          },
        },
      });
    },
  });

  const setEditCommentRecipe = useCallback(async ({ _id, editComment }) => {
    try {
      await editCommentRecipe({
        variables: {
          _id,
          input: {
            message: editComment,
            edited: true,
          },
        },
      });
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setVoteCommentRecipe = useCallback(async ({ _id }) => {
    try {
      await voteCommentRecipe({
        variables: {
          _id,
          input: {
            votes: 1,
          },
        },
      });
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
  }, []);

  const setSendCommentRecipe = useCallback(async ({ submitData, url }) => {
    const { message } = submitData;

    try {
      const { data } = await sendCommentRecipe({
        variables: {
          recipeUrl: url,
          input: {
            message,
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

  return {
    setEditCommentRecipe,
    setVoteCommentRecipe,
    setSendCommentRecipe,
  };
}
