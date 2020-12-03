import {
    SCREEN_MOBILE
} from '../../types';

const ResolutionReducer = (state, action) =>  {
    switch(action.type) {
        case SCREEN_MOBILE: 
            return {
                ...state,
                customer: action.payload
            }
        default: 
            return state
    }
}

export default ResolutionReducer;