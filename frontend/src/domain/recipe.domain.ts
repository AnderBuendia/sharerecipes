import {
  CreateRecipeFormData,
  CreateRecipe,
  RecipeImage,
} from '@Interfaces/domain/recipe.interface';

export function createRecipe(
  data: CreateRecipeFormData,
  recipeImage?: RecipeImage
): CreateRecipe {
  const {
    name,
    prepTime,
    serves,
    ingredients,
    difficulty,
    description,
    style,
    otherStyle,
  } = data;

  return {
    name,
    prepTime: Number(prepTime),
    serves: Number(serves),
    ingredients: ingredients,
    difficulty,
    style: otherStyle ? otherStyle : style,
    imageUrl: recipeImage?.imageUrl,
    imageName: recipeImage?.imageName,
    description,
  };
}
