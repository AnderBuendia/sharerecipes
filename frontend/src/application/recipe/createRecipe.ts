import { useRecipe } from '@Services/recipeAdapter';
import {
  RecipeImage,
  NewRecipeData,
} from '@Interfaces/domain/recipe.interface';
import { useNotifier } from '@Services/notificationAdapter';
import { MessageTypes } from '@Enums/config/messages.enum';

export function useCreateRecipe() {
  const { setNewRecipe } = useRecipe();
  const [newRecipeMutation] = setNewRecipe();
  const { notify } = useNotifier();

  const createRecipe = async ({
    data,
    recipeImage,
  }: {
    data: NewRecipeData;
    recipeImage?: RecipeImage;
  }) => {
    const {
      name,
      prep_time,
      serves,
      ingredients,
      description,
      difficulty,
      style,
      other_style,
    } = data;

    if (!recipeImage) {
      throw new Error('There is no image. Please upload an image.');
    }

    try {
      return await newRecipeMutation({
        variables: {
          input: {
            name,
            prep_time: Number(prep_time),
            serves: Number(serves),
            ingredients,
            difficulty,
            style: other_style ? other_style : style,
            image_url: recipeImage.image_url,
            image_name: recipeImage.image_name,
            description,
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

  return { createRecipe };
}
