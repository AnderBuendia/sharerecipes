import {
    RECIPE_IMAGE_URL
} from '../../types';

const ImagesReducer = (state, action) =>  {
    switch(action.type) {
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