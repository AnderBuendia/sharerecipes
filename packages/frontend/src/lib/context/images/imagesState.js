// @ts-nocheck
import React, { useReducer } from 'react';
import ImagesContext from './imagesContext';
import ImagesReducer from './imagesReducer';

import {
    RECIPE_IMAGE_URL
} from '../../types';

const ImagesState = ({ children }) => {

    const initialState = {
        recipe_image: ''
    };

    const [state, dispatch] = useReducer(ImagesReducer, initialState);

    /* Set Recipe Image */
    const setRecipeImage = url => {
        dispatch({
            type: RECIPE_IMAGE_URL,
            payload: url
        });
    };

    return (
        <ImagesContext.Provider 
            value={{ 
                recipe_image: state.recipe_image,
                setRecipeImage,
            }}
        >
            {children}
        </ImagesContext.Provider>
    );
};

export default ImagesState;