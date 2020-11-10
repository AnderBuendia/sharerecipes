import React, { useReducer } from 'react';
import resolutionContext from './resolutionContext';
import resolutionReducer from './resolutionReducer';

import {
    SCREEN_MOBILE
} from '../../types';

const ResolutionState = ({ children }) => {

    const initialState = {
        width: ''
    };

    const [state, dispatch] = useReducer(resolutionReducer, initialState);

     /* Modify customer */
     const screenWidth = width => {
        // console.log(customer);
        dispatch({
            type: SCREEN_MOBILE,
            payload: width
        });
    };

    return (
        <resolutionContext.Provider 
            value={{ 
                width: state.width,
                screenWidth
            }}
        >
            {children}
        </resolutionContext.Provider>
    );
};

export default ResolutionState;