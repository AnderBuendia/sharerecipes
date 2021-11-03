import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { GET_RECIPE } from '@Lib/graphql/recipe/query';
import {
  EDIT_COMMENT_RECIPE,
  VOTE_COMMENT_RECIPE,
  SEND_COMMENT_RECIPE,
} from '@Lib/graphql/comment/mutation';
import { QueryDataGetRecipe } from '@Types/apollo/query/recipe.type';

export default function useCommentRecipe({ url }: { url: string }) {
  const { addToast } = useToasts();

  const [editCommentRecipe] = useMutation(EDIT_COMMENT_RECIPE);
  const [voteCommentRecipe] = useMutation(VOTE_COMMENT_RECIPE);

  const [sendCommentRecipe] = useMutation(SEND_COMMENT_RECIPE, {
    update(cache, { data: { sendCommentRecipe } }) {
      const data = cache.readQuery<QueryDataGetRecipe>({
        query: GET_RECIPE,
        variables: {
          recipeUrl: url,
          offset: 0,
          limit: 10,
        },
      });

      if (data) {
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
      }
    },
  });

  const setEditCommentRecipe = useCallback(
    async ({ _id, message }: { _id: string; message: string }) => {
      try {
        await editCommentRecipe({
          variables: {
            _id,
            input: {
              message,
              edited: true,
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
    [editCommentRecipe]
  );

  const setVoteCommentRecipe = useCallback(
    async ({ _id }: { _id: string }) => {
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
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [voteCommentRecipe]
  );

  const setSendCommentRecipe = useCallback(
    async ({ message, url }: { message: string; url: string }) => {
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
        if (error instanceof Error) {
          addToast(error.message.replace('GraphQL error: ', ''), {
            appearance: 'error',
          });
        }
      }
    },
    [sendCommentRecipe]
  );

  return {
    setEditCommentRecipe,
    setVoteCommentRecipe,
    setSendCommentRecipe,
  };
}
