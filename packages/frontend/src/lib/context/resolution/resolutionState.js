import React, { useReducer, useContext, useEffect } from 'react';
import ResolutionContext from './resolutionContext';
import ResolutionReducer from './resolutionReducer';
import { SWITCH_RESOLUTION } from '../../types/index';

const ResolutionState = ({ children }) => {
    const initialState = {
        width: 0,
    };

    const [state, dispatch] = useReducer(
        ResolutionReducer, 
        initialState,
    );

    const setWidth = (payload) => {
        dispatch({
            type: SWITCH_RESOLUTION,
            payload,
        })
    }

    return (
        <ResolutionContext.Provider 
            value={{ 
                width: state.width,
                setWidth,
            }}
        >
            {children}
        </ResolutionContext.Provider>
    );
};

export const useBrowserPreferences = () => {
    const { width, setWidth } = useContext(
        ResolutionContext
    );
   
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, [width]);

    return { width };
}

export default ResolutionState;