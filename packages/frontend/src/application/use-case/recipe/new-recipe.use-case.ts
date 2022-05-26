import { useRecipe } from '@Services/recipeAdapter';
import { createRecipe } from '@Domain/recipe.domain';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';
import type {
  RecipeImage,
  CreateRecipeFormData,
} from '@Interfaces/domain/recipe.interface';

export function useNewRecipe() {
  const { setCreateRecipe } = useRecipe();
  const [create_recipe] = setCreateRecipe();
  const { notify } = useNotifier();

  const newRecipe = async ({
    data,
    recipeImage,
  }: {
    data: CreateRecipeFormData;
    recipeImage?: RecipeImage;
  }) => {
    try {
      if (!recipeImage)
        throw new Error('There is no image. Please upload an image.');

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
        notify({
          message: error.message.replace('GraphQL error: ', ''),
          messageType: MessageTypes.ERROR,
        });
      }
    }
  };

  return { newRecipe };
}
