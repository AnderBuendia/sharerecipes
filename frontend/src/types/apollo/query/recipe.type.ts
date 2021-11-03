import { IRecipe } from '@Interfaces/recipe/recipe.interface';

export type QueryDataGetRecipes = {
  getRecipes: IRecipe[];
};

export type QueryDataGetRecipe = {
  getRecipe: IRecipe;
};
