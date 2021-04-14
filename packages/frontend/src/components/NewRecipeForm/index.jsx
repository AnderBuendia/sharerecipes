import { useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import useNewRecipeForm from './hook';
import Input from '../generic/Input';
import { FormMessages } from '../../enums/config/messages';
import { foodStyle, difficulty } from '../../enums/select-form-options';

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

  /* React hook form */
  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onChange',
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Recipe Name"
          childRef={register({
            required: {
              value: true,
              message: FormMessages.USER_REQUIRED,
            },
          })}
          error={errors.name}
        />

        <Input
          label="Preparation Time"
          name="prep_time"
          type="number"
          placeholder="Preparation Time"
          childRef={register({
            required: {
              value: true,
              message: FormMessages.PREP_TIME_REQUIRED,
            },
          })}
          error={errors.prep_time}
        />

        <Input
          label="Serves"
          name="serves"
          type="number"
          placeholder="Number of Serves"
          childRef={register({
            required: {
              value: true,
              message: FormMessages.SERVES_REQUIRED,
            },
          })}
          error={errors.serves}
        />

        <div className="border w-full bg-white mt-6 mb-4 rounded-lg shadow appearance-none">
          <label className="block text-black text-md font-body font-bold mx-3 my-2">
            Ingredients
          </label>
          {indexes.map((index) => {
            const fieldName = `ingredients[${index}]`;
            return (
              <div className="mx-3 my-3" key={fieldName}>
                <input
                  className="font-body shadow appearance-none border rounded w-11/12 py-2 px-3 
              text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  name={fieldName}
                  type="text"
                  placeholder="Introduce your ingredients"
                  ref={register({
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

        <label className="block text-black text-md font-body font-bold mb-2">
          Recipe Difficulty
        </label>
        <Controller
          as={
            <ReactSelect
              instanceId="selected-difficulty"
              className="mt-2 mb-4 font-body shadow appearance-none"
              placeholder="Select a recipe difficulty..."
              options={difficulty}
            />
          }
          defaultValue={selectedDifficulty}
          name="difficulty"
          onChange={setSelectedDifficulty}
          control={control}
        />

        <label className="block text-black text-md font-body font-bold mb-2">
          Food Style
        </label>
        <Controller
          render={({ onChange }) => (
            <ReactSelect
              instanceId="selected-food-style"
              className="mt-2 mb-4 font-body shadow appearance-none"
              placeholder="Select a food style..."
              options={foodStyle}
              onChange={(foodValue) => {
                setSelectedFoodStyle(foodValue);
                onChange(foodValue);
              }}
            />
          )}
          name="style"
          defaultValue={selectedFoodStyle}
          control={control}
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

        <label className="block text-black text-md font-body font-bold mb-2">
          Description of your Recipe
        </label>
        <textarea
          className="font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                  text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
          name="description"
          placeholder="Introduce your recipe..."
          ref={register({
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
