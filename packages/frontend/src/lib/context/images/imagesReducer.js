import {
    USER_IMAGE_URL,
    RECIPE_IMAGE_URL
} from '../../types';

const ImagesReducer = (state, action) =>  {
    switch(action.type) {
        case USER_IMAGE_URL: 
            return {
                ...state,
                user_image: action.payload
            }
        case RECIPE_IMAGE_URL: 
            return {
                ...state,
                recipe_image: action.payload
            }
        default: 
            return state
    }
}

export default ImagesReducer;