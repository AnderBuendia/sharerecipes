export type FetchMoreFindRecipesArgs = {
  variables: {
    sort: string;
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
