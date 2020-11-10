import {
    SCREEN_MOBILE
} from '../../types';

export default ( state, action ) => {
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