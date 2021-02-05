// @ts-nocheck
import React, { useReducer } from 'react';
import ImagesContext from './imagesContext';
import ImagesReducer from './imagesReducer';

import {
    USER_IMAGE_URL,
    RECIPE_IMAGE_URL
} from '../../types';

const ImagesState = ({ children }) => {

    const initialState = {
        user_image: '',
        recipe_image: ''
    };

    const [state, dispatch] = useReducer(ImagesReducer, initialState);

    /* Set User Image */
    const setUserImage = url => {
        dispatch({
            type: USER_IMAGE_URL,
            payload: url
        });
    };

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
                user_image: state.user_image,
                recipe_image: state.recipe_image,
                setUserImage,
                setRecipeImage
            }}
        >
            {children}
        </ImagesContext.Provider>
    );
};

export default ImagesState;