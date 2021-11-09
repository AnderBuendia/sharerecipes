import { useMutation } from '@apollo/client';
import { GET_RECIPE } from '@Lib/graphql/recipe/query';
import {
  SEND_COMMENT_RECIPE,
  VOTE_COMMENT_RECIPE,
  EDIT_COMMENT_RECIPE,
} from '@Lib/graphql/comment/mutation';
import { CommentService } from '@Interfaces/ports/comment.interface';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { QueryDataGetRecipe } from '@Types/apollo/query/recipe.type';

export function useComment(): CommentService {
  const setSendCommentRecipe = ({
    recipeUrl,
  }: {
    recipeUrl: IRecipe['url'];
  }) => {
    return useMutation(SEND_COMMENT_RECIPE, {
      update(cache, { data: { sendCommentRecipe } }) {
        const data = cache.readQuery<QueryDataGetRecipe>({
          query: GET_RECIPE,
          variables: {
            recipeUrl,
            offset: 0,
            limit: 10,
          },
        });

        if (data) {
          cache.writeQuery({
            query: GET_RECIPE,
            variables: {
              recipeUrl,
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
  };

  const setVoteCommentRecipe = () => {
    return useMutation(VOTE_COMMENT_RECIPE);
  };

  const setEditCommentRecipe = () => {
    return useMutation(EDIT_COMMENT_RECIPE);
  };

  return { setSendCommentRecipe, setVoteCommentRecipe, setEditCommentRecipe };
}
