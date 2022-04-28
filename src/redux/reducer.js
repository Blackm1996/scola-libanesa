import { TOGGLE_LANG, TOGGLE_ROLE, TOGGLE_ID_INSTRUCTOR } from './actions';

function reducer(state, action) {

    // toggle language app
    if (action.type === TOGGLE_LANG) {
        return {
            ...state,
            language: action.payload.lang
        }
    }
    if ( action.type === TOGGLE_ROLE ) {
       return {
            ...state,
            role: action.payload.role
        } 
    }
    if ( action.type === TOGGLE_ID_INSTRUCTOR ) {
       return {
            ...state,
            idInstructor: action.payload.idInstructor
        } 
    }
    return state;
}

export default reducer;