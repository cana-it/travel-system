import { mainTypes } from '../Actions'
const initialState = {
    IsLoading: false,
    language: 'vn',
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        
        case mainTypes.LOADING_SUCCESS:
            return {
                ...state,
                IsLoading: action.payload
            }
        case mainTypes.CHANGE_LANGUAGE_SUCCESS:
            return {
                ...state,
                language: action.payload
            };
        case mainTypes.CHECK_LANGUAGE_SUCCESS:
            return {
                ...state,
                language: action.payload
            };
        default:
            return state;
    }
}
