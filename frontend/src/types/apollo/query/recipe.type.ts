import { IRecipe } from '@Interfaces/domain/recipe.interface';

export type QueryDataGetRecipes = {
  getRecipes: IRecipe[];
};

export type QueryDataGetRecipe = {
  getRecipe: IRecipe;
};
