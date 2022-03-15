import container from '@Shared/infrastructure/IoC/container';

const commentResolvers = {
  Comment: {
    author: async ({ author }) =>
      container.cradle.findUserByIdQuery.execute(author),
  },

  Mutation: {
    edit_comment: (_, { commentId, input }, ctx) =>
      container.cradle.updateCommentUseCase.execute(
        commentId,
        input,
        ctx.req.user?._id
      ),

    vote_comment: (_, { commentId, input }, ctx) =>
      container.cradle.voteCommentUseCase.execute(
        commentId,
        input,
        ctx.req.user?._id
      ),

    send_recipe_comment: (_, { recipeUrlQuery, input }, ctx) =>
      container.cradle.sendRecipeCommentUseCase.execute(
        recipeUrlQuery,
        input,
        ctx.req.user?._id
      ),
  },
};

export default commentResolvers;
