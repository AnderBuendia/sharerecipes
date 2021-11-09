import { MutationTuple, OperationVariables } from '@apollo/client';
import { IRecipe } from '@Interfaces/domain/recipe.interface';

export interface CommentService {
  setSendCommentRecipe: ({
    recipeUrl,
  }: {
    recipeUrl: IRecipe['url'];
  }) => MutationTuple<any, OperationVariables>;
  setVoteCommentRecipe: () => MutationTuple<any, OperationVariables>;
  setEditCommentRecipe: () => MutationTuple<any, OperationVariables>;
}
