import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { useForm, FieldError } from 'react-hook-form';
import type { SingleValue } from 'react-select';
import { useNewRecipe } from '@Application/use-case/recipe/new-recipe.use-case';
import { foodStyle, difficulty } from '@Lib/utils/select-options/new-recipe';
import useNewRecipeForm from '@Components/Forms/NewRecipeForm/hook';
import Input from '@Components/generic/Input';
import ReactSelect from '@Components/generic/ReactSelect';
import DragDropImage from '@Components/generic/DragDropImage';
import { AlertMessages, FormMessages } from '@Enums/config/messages.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { ApiV1RestEndPoints } from '@Enums/paths/rest-endpoints.enum';
import type { SelectOption } from '@Interfaces/select/option.interface';
import type { RecipeImage } from '@Interfaces/domain/recipe.interface';
import type { FormValuesNewRecipe } from '@Types/forms/new-recipe.type';

const NewRecipeForm: FC = () => {
  const router = useRouter();
  const [recipeImage, setRecipeImage] = useState<RecipeImage>();
  const { newRecipe } = useNewRecipe();
  const {
    selectedFoodStyle,
    setSelectedFoodStyle,
    indexes,
    counter,
    selectedDifficulty,
    setSelectedDifficulty,
    addIngredients,
    removeIngredients,
  } = useNewRecipeForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValuesNewRecipe>();

  const handleChangeDifficulty = (option: SingleValue<SelectOption>) => {
    if (option) {
      setValue('difficulty', option.value);
      setSelectedDifficulty({ difficulty: option });
    }
  };

  const handleChangeFoodStyle = (option: SingleValue<SelectOption>) => {
    if (option) {
      setValue('style', option.value);
      setSelectedFoodStyle({ foodStyle: option });
    }
  };

  const handleChangeImage = (imageUrl: string, imageName: string) => {
    setRecipeImage({ imageUrl: imageUrl, imageName: imageName });
  };

  const onSubmit = handleSubmit(async (data) => {
    const response = await newRecipe({ data, recipeImage });

    if (response?.data) {
      setRecipeImage({ imageUrl: undefined, imageName: undefined });

      router.push(MainPaths.INDEX);

      Swal.fire('Correct', AlertMessages.RECIPE_CREATED, 'success');
    }
  });

  useEffect(() => {
    register('difficulty');
    register('style');
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      <h2 className="text-4xl font-roboto font-bold text-center my-3">
        Create New Recipe
      </h2>
      <label className="block font-body font-bold mb-4">Recipe Image</label>
      <div className="overflow-hidden my-4 rounded-md text-black">
        <DragDropImage
          url={`${process.env.NEXT_PUBLIC_BACKEND_URL}${ApiV1RestEndPoints.UPLOAD_RECIPE_IMAGE}`}
          current={recipeImage?.imageUrl}
          name="photo"
          rounded={false}
          handleChange={handleChangeImage}
        />
      </div>
      <form onSubmit={onSubmit}>
        <Input
          label="Name"
          type="text"
          placeholder="Recipe Name"
          register={{
            ...register('name', {
              required: FormMessages.USER_REQUIRED,
            }),
          }}
          error={errors.name}
        />
        <Input
          label="Preparation Time"
          type="number"
          placeholder="Preparation Time"
          register={{
            ...register('prepTime', {
              required: FormMessages.PREP_TIME_REQUIRED,
            }),
          }}
          error={errors.prepTime}
        />
        <Input
          label="Serves"
          type="number"
          placeholder="Number of Serves"
          register={{
            ...register('serves', {
              required: FormMessages.SERVES_REQUIRED,
            }),
          }}
          error={errors.serves}
        />
        <div className="border w-full bg-white dark:bg-gray-700 mt-6 mb-4 rounded-lg shadow appearance-none">
          <label className="block font-body font-bold mx-3 my-2">
            Ingredients
          </label>
          {indexes.map((index: number) => {
            return (
              <div className="mx-3 my-3" key={index}>
                <input
                  className="bg-white font-body shadow appearance-none border rounded w-11/12 py-2 px-3 
              text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Introduce your ingredients"
                  {...register(`ingredients.${index}`, {
                    required: FormMessages.INGREDIENTS_REQUIRED,
                  })}
                />

                <button
                  type="button"
                  className="w-7 bg-red-700 ml-1 p-1 text-white text-center rounded"
                  onClick={() => removeIngredients(index, counter)}
                >
                  <span>-</span>
                </button>

                {errors?.ingredients &&
                  (errors.ingredients as any).map(
                    (error: FieldError, index: number) => (
                      <div
                        key={index}
                        className="my-3 bg-red-200 border-l-4 border-red-700 text-red-700 p-2"
                      >
                        <p>{error.message}</p>
                      </div>
                    )
                  )}
              </div>
            );
          })}

          <button
            type="button"
            className="bg-black w-1/2 py-2 rounded-lg text-white mx-3 my-2 hover:bg-gray-800"
            onClick={() => addIngredients(indexes, counter)}
          >
            Add an Ingredient
          </button>
        </div>

        <ReactSelect
          instance="selected-difficulty"
          label="Recipe Difficulty"
          style="text-gray-800 mt-2 mb-4 font-body shadow appearance-none"
          placeholder="Select a recipe difficulty..."
          options={difficulty}
          handleChange={handleChangeDifficulty}
          value={selectedDifficulty}
          name="difficulty"
        />

        <ReactSelect
          instance="selected-food-style"
          label="Food Style"
          style="text-gray-800 mt-2 mb-4 font-body shadow appearance-none"
          placeholder="Select a food style..."
          options={foodStyle}
          handleChange={handleChangeFoodStyle}
          value={selectedFoodStyle}
          name="style"
        />

        {selectedFoodStyle.value === 'other' && (
          <Input
            label="Other Style"
            type="text"
            placeholder="Introduce that style"
            register={{
              ...register('otherStyle', {
                required: FormMessages.STYLE_REQUIRED,
              }),
            }}
          />
        )}

        <label className="block font-body font-bold mb-2">
          Description of your Recipe
        </label>
        <textarea
          className="bg-white font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                  text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Introduce your recipe..."
          {...register('description', {
            required: FormMessages.DESCRIPTION_REQUIRED,
          })}
        />
        <button className="btn-form bg-black">
          <span>Create New Recipe</span>
        </button>
      </form>
    </div>
  );
};

export default NewRecipeForm;
