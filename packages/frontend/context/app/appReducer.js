import {
    SCREEN_MOBILE
} from '../../types';

const AppReducer = (state, action) =>  {
    switch(action.type) {
        case SCREEN_MOBILE: 
            return {
                ...state,
                width: action.payload
            }
        default: 
            return state
    }
}

export default AppReducer;