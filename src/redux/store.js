/* Readable Scalable Secure */
import { createStore } from "redux";
import { ENGLISH, SCHOOL_YEAR, ROLE, ID_INSTRUCTOR } from "../languages";
import reducer from "./reducer";

// Initial Store
const initialStore = {
  language: ENGLISH,
  schoolYear: SCHOOL_YEAR,
  role: ROLE,
  idInstructor: ID_INSTRUCTOR
};
// Create Store
const store = createStore(
  reducer,
  initialStore,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
