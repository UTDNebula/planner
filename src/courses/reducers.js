import { FILTER_COURSES } from "./actions";

export default function courses(state = [], action) {
  switch (action.type) {
    case FILTER_COURSES:
      return state;
    default:
      console.debug('Not a valid action: ' + action);
      return state;
  }
}