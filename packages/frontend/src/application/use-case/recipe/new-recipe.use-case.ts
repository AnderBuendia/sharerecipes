import { useRecipe } from '@Services/recipe.service';
import { createRecipe } from '@Domain/recipe.domain';
import { useNotifier } from '@Services/notification.service';
import type {
  RecipeImage,
  CreateRecipeFormData,
} from '@Interfaces/domain/recipe.interface';

export function useNewRecipe() {
  const { setCreateRecipe } = useRecipe();
  const [create_recipe] = setCreateRecipe();
  const { notifyError } = useNotifier();

  const newRecipe = async ({
    data,
    recipeImage,
  }: {
    data: CreateRecipeFormData;
    recipeImage?: RecipeImage;
  }) => {
    try {
      if (!recipeImage) {
        throw new Error('There is no image. Please upload an image.');
      }

      const recipe = createRecipe(data, recipeImage);

      return await create_recipe({
        variables: {
          input: {
            name: recipe.name,
            prepTime: recipe.prepTime,
            serves: recipe.serves,
            ingredients: recipe.ingredients,
            difficulty: recipe.difficulty,
            style: recipe.style,
            imageUrl: recipe.imageUrl,
            imageName: recipe.imageName,
            description: recipe.description,
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        notifyError({ message: error.message.replace('GraphQL error: ', '') });
      }
    }
  };

  return { newRecipe };
}
