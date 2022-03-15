import { IRecipe } from '@Interfaces/domain/recipe.interface';

export type QueryDataFindRecipes = {
  find_recipes: IRecipe[];
};

export type QueryDataFindRecipe = {
  find_recipe: IRecipe;
};
