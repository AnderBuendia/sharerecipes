import React, { useReducer } from 'react';
import appContext from './appContext';
import appReducer from './appReducer';

import {
    SCREEN_MOBILE
} from '../../types';

const AppState = ({ children }) => {

    const initialState = {
        width: ''
    };

    const [state, dispatch] = useReducer(appReducer, initialState);

    /* Set screen width */
    const screenWidth = width => {
        dispatch({
            type: SCREEN_MOBILE,
            payload: width
        });
    };

    return (
        <appContext.Provider 
            value={{ 
                width: state.width,
                screenWidth,
            }}
        >
            {children}
        </appContext.Provider>
    );
};

export default AppState;