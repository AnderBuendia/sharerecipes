export type FetchMoreFindRecipesArgs = {
  variables: {
    sort: string;
    query?: string;
    offset: number;
    limit: number;
  };
};

export type FetchMoreFindRecipeArgs = {
  variables: {
    recipeUrlQuery?: string;
    offset: number;
    limit: number;
  };
};
