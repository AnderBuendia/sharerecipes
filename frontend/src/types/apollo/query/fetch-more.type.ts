export type FetchMoreGetRecipesArgs = {
  variables: {
    offset: number;
    limit: number;
  };
};

export type FetchMoreGetRecipeArgs = {
  variables: {
    recipeUrl?: string;
    offset: number;
    limit: number;
  };
};
