import container from '@Shared/infrastructure/IoC/container';

const DEFAULT_SORTED_RECIPES = '-createdAt';
const DEFAULT_SEARCH_QUERY_RECIPES = '';

const recipeResolvers = {
  /* Types to relation DBs */
  Recipe: {
    author: ({ author }) => container.cradle.findUserByIdQuery.execute(author),

    comments: (recipe, { offset, limit }) =>
      container.cradle.findCommentsByRecipeIdQuery.execute(
        recipe._id,
        offset,
        limit
      ),
  },

  Query: {
    find_recipe: (_, { recipeUrlQuery, offset = 0, limit = 20 }) =>
      container.cradle.findRecipeByUrlQuery.execute(recipeUrlQuery),

    find_recipes: (
      _,
      {
        sort = DEFAULT_SORTED_RECIPES,
        query = DEFAULT_SEARCH_QUERY_RECIPES,
        offset = 0,
        limit = 20,
      }
    ) => container.cradle.findRecipesQuery.execute(sort, query, offset, limit),
  },

  Mutation: {
    create_recipe: async (_, { input }, ctx) =>
      container.cradle.createRecipeUseCase.execute(input, ctx.req.user?._id),

    delete_recipe: async (_, { recipeId }, ctx) =>
      container.cradle.deleteRecipeUseCase.execute(recipeId, ctx.req.user?._id),

    vote_recipe: async (_, { recipeUrlQuery, input }, ctx) =>
      container.cradle.voteRecipeUseCase.execute(
        recipeUrlQuery,
        input,
        ctx.req.user?._id
      ),
  },
};

export default recipeResolvers;
