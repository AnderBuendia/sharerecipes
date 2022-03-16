import { useMutation } from '@apollo/client';
import { FIND_RECIPE } from '@Lib/graphql/recipe/query.gql';
import {
  SEND_RECIPE_COMMENT,
  VOTE_COMMENT,
  EDIT_COMMENT,
} from '@Lib/graphql/comment/mutation.gql';
import type { CommentService } from '@Interfaces/ports/comment.interface';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';
import type { QueryDataFindRecipe } from '@Types/apollo/query/recipe.type';

export function useComment(): CommentService {
  const setSendRecipeComment = ({
    recipeUrlQuery,
  }: {
    recipeUrlQuery: IRecipe['urlQuery'];
  }) => {
    return useMutation(SEND_RECIPE_COMMENT, {
      update(cache, { data: { send_recipe_comment } }) {
        const queryData = cache.readQuery<QueryDataFindRecipe>({
          query: FIND_RECIPE,
          variables: {
            recipeUrlQuery,
            offset: 0,
            limit: 10,
          },
        });

        if (queryData) {
          cache.writeQuery({
            query: FIND_RECIPE,
            variables: {
              recipeUrlQuery,
              offset: 0,
              limit: 10,
            },
            data: {
              find_recipe: {
                ...queryData.find_recipe,
                comments: [
                  ...queryData.find_recipe.comments,
                  send_recipe_comment,
                ],
              },
            },
          });
        }
      },
    });
  };

  const setVoteComment = () => {
    return useMutation(VOTE_COMMENT);
  };

  const setEditComment = () => {
    return useMutation(EDIT_COMMENT);
  };

  return { setSendRecipeComment, setVoteComment, setEditComment };
}
