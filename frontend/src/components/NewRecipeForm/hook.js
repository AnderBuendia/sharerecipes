// @ts-nocheck
import { useReducer } from 'react';

const ACTIONS = {
  SELECTED_FOOD_STYLE: 'SELECTED_FOOD_STYLE',
  SELECTED_DIFFICULTY: 'SELECTED_DIFFICULTY',
  ADD_INGREDIENTS: 'ADD_INGREDIENTS',
  REMOVE_INGREDIENTS: 'REMOVE_INGREDIENTS',
};

const ACTIONS_REDUCERS = {
  [ACTIONS.SELECTED_FOOD_STYLE]: (state, action) => ({
    ...state,
    selectedFoodStyle: action.payload,
  }),
  [ACTIONS.SELECTED_DIFFICULTY]: (state, action) => ({
    ...state,
    selectedDifficulty: action.payload,
  }),
  [ACTIONS.ADD_INGREDIENTS]: (state, action) => ({
    ...state,
    indexes: [...state.indexes, action.payload.counter],
    counter: action.payload.counter + 1,
  }),
  [ACTIONS.REMOVE_INGREDIENTS]: (state, action) => ({
    ...state,
    indexes: [...state.indexes.filter((item) => item !== action.payload.index)],
    counter: action.payload.counter + 1,
  }),
};

const reducer = (state, action) => {
  const actionReducer = ACTIONS_REDUCERS[action.type];
  return actionReducer ? actionReducer(state, action) : state;
};

export default function useNewRecipeForm() {
  const initialState = {
    selectedFoodStyle: null,
    selectedDifficulty: null,
    indexes: [],
    counter: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    selectedFoodStyle: state.selectedFoodStyle,
    selectedDifficulty: state.selectedDifficulty,
    indexes: state.indexes,
    counter: state.counter,
    setSelectedFoodStyle: (foodStyle) =>
      dispatch({ type: ACTIONS.SELECTED_FOOD_STYLE, payload: foodStyle }),
    setSelectedDifficulty: (difficulty) =>
      dispatch({ type: ACTIONS.SELECTED_DIFFICULTY, payload: difficulty }),
    addIngredients: (indexes, counter) =>
      dispatch({
        type: ACTIONS.ADD_INGREDIENTS,
        payload: {
          indexes,
          counter,
        },
      }),
    removeIngredients: (index, counter) =>
      dispatch({
        type: ACTIONS.REMOVE_INGREDIENTS,
        payload: {
          index,
          counter,
        },
      }),
  };
}
