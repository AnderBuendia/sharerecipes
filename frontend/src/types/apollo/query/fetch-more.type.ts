export type FetchMoreGetRecipesArgs = {
  variables: {
    offset: number;
    limit: number;
    sort: string;
  };
};

export type FetchMoreGetRecipeArgs = {
  variables: {
    recipeUrl?: string;
    offset: number;
    limit: number;
  };
};
