import {
    SWITCH_RESOLUTION
} from '../../types';

const ResolutionReducer = (state, action) =>  {
    switch(action.type) {
        case SWITCH_RESOLUTION: 
            return {
                ...state,
                width: action.payload,
            }
        default: 
            return state
    }
}

export default ResolutionReducer;