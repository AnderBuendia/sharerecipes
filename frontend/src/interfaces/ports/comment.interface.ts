import { MutationTuple, OperationVariables } from '@apollo/client';
import { IRecipe } from '@Interfaces/domain/recipe.interface';

export interface CommentService {
  setSendRecipeComment: ({
    recipeUrlQuery,
  }: {
    recipeUrlQuery: IRecipe['url_query'];
  }) => MutationTuple<any, OperationVariables>;

  setVoteComment: () => MutationTuple<any, OperationVariables>;

  setEditComment: () => MutationTuple<any, OperationVariables>;
}
