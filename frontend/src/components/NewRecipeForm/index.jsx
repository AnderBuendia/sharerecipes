import { useForm } from 'react-hook-form';
import useNewRecipeForm from '@Components/NewRecipeForm/hook';
import Input from '@Components/generic/Input';
import ReactSelect from '@Components/generic/ReactSelect';
import { FormMessages } from '@Enums/config/messages';
import { foodStyle, difficulty } from '@Enums/select-form-options';

const NewRecipeForm = ({ onSubmit }) => {
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
    formState: { errors },
  } = useForm();

  const handleChangeDifficulty = (difficultyValue) => {
    setSelectedDifficulty(difficultyValue);
  };

  const handleChangeFoodStyle = (foodValue) => {
    setSelectedFoodStyle(foodValue);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Recipe Name"
          register={{
            ...register('name', {
              required: {
                value: true,
                message: FormMessages.USER_REQUIRED,
              },
            }),
          }}
          error={errors.name}
        />
        <Input
          label="Preparation Time"
          name="prep_time"
          type="number"
          placeholder="Preparation Time"
          childRef={{
            ...register('prep_time', {
              required: {
                value: true,
                message: FormMessages.PREP_TIME_REQUIRED,
              },
            }),
          }}
          error={errors.prep_time}
        />
        <Input
          label="Serves"
          name="serves"
          type="number"
          placeholder="Number of Serves"
          childRef={{
            ...register('serves', {
              required: {
                value: true,
                message: FormMessages.SERVES_REQUIRED,
              },
            }),
          }}
          error={errors.serves}
        />
        <div className="border w-full bg-white dark:bg-gray-700 mt-6 mb-4 rounded-lg shadow appearance-none">
          <label className="block font-body font-bold mx-3 my-2">
            Ingredients
          </label>
          {indexes.map((index) => {
            const fieldName = `ingredients[${index}]`;
            return (
              <div className="mx-3 my-3" key={fieldName}>
                <input
                  className="bg-white font-body shadow appearance-none border rounded w-11/12 py-2 px-3 
              text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  name={fieldName}
                  type="text"
                  placeholder="Introduce your ingredients"
                  {...register(`${fieldName}`, {
                    required: {
                      value: true,
                      message: 'Ingredients are required',
                    },
                  })}
                />

                <button
                  type="button"
                  className="w-7 bg-red-700 ml-1 p-1 text-white text-center rounded"
                  onClick={() => removeIngredients(index, counter)}
                >
                  -
                </button>

                {errors.ingredients && errors.ingredients[index] && (
                  <div className="my-3 bg-red-200 border-l-4 border-red-700 text-red-700 p-2">
                    <p>{errors.ingredients[index].message}</p>
                  </div>
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
          placeholder="Select a recipe difficulty..."
          options={difficulty}
          handleChange={handleChangeDifficulty}
          value={selectedDifficulty}
        />

        <ReactSelect
          instance="selected-food-style"
          label="Food Style"
          placeholder="Select a food style..."
          options={foodStyle}
          handleChange={handleChangeFoodStyle}
          value={selectedFoodStyle}
        />

        {selectedFoodStyle?.value === 'other' && (
          <Input
            name="other_style"
            type="text"
            placeholder="Introduce that style"
            childRef={register}
          />
        )}
        <label className="block text-black font-body font-bold mb-2">
          Description of your Recipe
        </label>
        <textarea
          className="bg-white font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                  text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
          name="description"
          placeholder="Introduce your recipe..."
          {...register('description', {
            required: {
              value: true,
              message: FormMessages.DESCRIPTION_REQUIRED,
            },
          })}
        />
        <input
          className="btn-primary"
          type="submit"
          value="Create New Recipe"
        />
      </form>
    </>
  );
};

export default NewRecipeForm;
