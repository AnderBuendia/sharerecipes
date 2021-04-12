// @ts-nocheck
import { useReducer } from 'react';

const ACTIONS = {
  RECIPE_IMAGE_URL: 'RECIPE_IMAGE_URL',
};

const ACTIONS_REDUCERS = {
  [ACTIONS.RECIPE_IMAGE_URL]: (state, action) => ({
    ...state,
    recipe_image: action.payload,
  }),
};

const reducer = (state, action) => {
  const actionReducer = ACTIONS_REDUCERS[action.type];
  return actionReducer ? actionReducer(state, action) : state;
};

export default function useRecipeImage() {
  const initialState = {
    recipe_image: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    recipe_image: state.recipe_image,
    setRecipeImage: (url) => {
      dispatch({
        type: RECIPE_IMAGE_URL,
        payload: url,
      });
    },
  };
}
