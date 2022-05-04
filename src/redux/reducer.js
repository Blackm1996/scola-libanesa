import {
  TOGGLE_LANG,
  TOGGLE_ROLE,
  TOGGLE_ID_INSTRUCTOR,
  TOGGLE_SCHOOL_YEAR,
  TOGGLE_REGISTRATION_SCHOOL_YEAR,
} from "./actions";

function reducer(state, action) {
  // toggle language app
  if (action.type === TOGGLE_LANG) {
    return {
      ...state,
      language: action.payload.lang,
    };
  }
  if (action.type === TOGGLE_ROLE) {
    return {
      ...state,
      role: action.payload.role,
    };
  }
  if (action.type === TOGGLE_ID_INSTRUCTOR) {
    return {
      ...state,
      idInstructor: action.payload.idInstructor,
    };
  }
  if (action.type === TOGGLE_SCHOOL_YEAR) {
    return {
      ...state,
      schoolYear: action.payload.schoolYear,
    };
  }
  if (action.type === TOGGLE_REGISTRATION_SCHOOL_YEAR) {
    return {
      ...state,
      registrationSchoolYear: action.payload.registrationSchoolYear,
    };
  }
  return state;
}

export default reducer;
