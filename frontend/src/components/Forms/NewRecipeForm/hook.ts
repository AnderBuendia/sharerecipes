import { useReducer } from 'react';
import {
  ActionType,
  Action,
} from '@Components/Forms/NewRecipeForm/state/actions';
import { SelectOption } from '@Interfaces/select/option.interface';

export interface NewRecipeFormState {
  selectedFoodStyle: SelectOption;
  selectedDifficulty: SelectOption;
  indexes: number[];
  counter: number;
}
const initialState: NewRecipeFormState = {
  selectedFoodStyle: { value: '', label: '' },
  selectedDifficulty: { value: '', label: '' },
  indexes: [],
  counter: 0,
};

const reducer = (
  state: NewRecipeFormState,
  action: Action
): NewRecipeFormState => {
  switch (action.type) {
    case ActionType.SELECT_FOOD_STYLE:
      return {
        ...state,
        selectedFoodStyle: action.payload,
      };
    case ActionType.SELECT_DIFFICULTY:
      return {
        ...state,
        selectedDifficulty: action.payload,
      };
    case ActionType.ADD_INGREDIENTS:
      return {
        ...state,
        indexes: [...state.indexes, action.payload.counter],
        counter: action.payload.counter + 1,
      };
    case ActionType.REMOVE_INGREDIENTS:
      return {
        ...state,
        indexes: [
          ...state.indexes.filter((item) => item !== action.payload.index),
        ],
        counter: action.payload.counter + 1,
      };
    default:
      return state;
  }
};

export default function useNewRecipeForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    setSelectedFoodStyle: ({ foodStyle }: { foodStyle: SelectOption }) =>
      dispatch({ type: ActionType.SELECT_FOOD_STYLE, payload: foodStyle }),
    setSelectedDifficulty: ({ difficulty }: { difficulty: SelectOption }) =>
      dispatch({ type: ActionType.SELECT_DIFFICULTY, payload: difficulty }),
    addIngredients: (indexes: number[], counter: number) =>
      dispatch({
        type: ActionType.ADD_INGREDIENTS,
        payload: {
          indexes,
          counter,
        },
      }),
    removeIngredients: (index: number, counter: number) =>
      dispatch({
        type: ActionType.REMOVE_INGREDIENTS,
        payload: {
          index,
          counter,
        },
      }),
    selectedFoodStyle: state.selectedFoodStyle,
    selectedDifficulty: state.selectedDifficulty,
    indexes: state.indexes,
    counter: state.counter,
  };
}
