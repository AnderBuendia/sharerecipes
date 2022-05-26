import container from '@Shared/infrastructure/IoC/container';

/* User Resolvers */
const userResolvers = {
  Query: {
    find_user: (_, {}, ctx) =>
      container.cradle.findUserByIdQuery.execute(ctx.req.user?._id),

    find_user_recipes: (_, {}, ctx) =>
      container.cradle.findRecipesByUserIdQuery.execute(ctx.req.user?._id),

    find_users: (_, { offset = 0, limit = 10 }) =>
      container.cradle.findUsersQuery.execute(offset, limit),
  },

  Mutation: {
    create_user: async (_, { input }) =>
      container.cradle.createUserUseCase.execute(input),

    authenticate_user: async (_, { input }) =>
      container.cradle.authUserUseCase.execute(input),

    update_user: async (_, { input }, ctx) =>
      container.cradle.updateUserUseCase.execute(input, ctx.req.user?._id),

    update_user_password: async (_, { input }, ctx) =>
      container.cradle.updateUserUseCase.execute(input, ctx.req.user?._id),

    delete_user: async (_, { input }, ctx) =>
      container.cradle.deleteUserUseCase.execute(input, ctx.req.user?._id),

    confirm_user: async (_, { input }) =>
      container.cradle.confirmUserUseCase.execute(input),

    forgot_user_password: async (_, { input }) =>
      container.cradle.forgotUserPasswordUseCase.execute(input),

    reset_user_password: async (_, { input }, ctx) =>
      container.cradle.resetUserPasswordUseCase.execute(input, ctx.res),
  },
};

export default userResolvers;
