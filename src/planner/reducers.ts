import { ADD_COURSE, CREATE_SCHEDULE, DELETE_SCHEDULE, UPDATE_SCHEDULE } from './actions';
// import { Schedule } from '../lib/types';


/**
 * The main data store for actions.
 *
 * @param {Array<import("../lib/types").Schedule>} 
 * @param {ScheduleAction}
 */
export default function schedules(state = [], action: any) {
  switch (action.type) {
    case ADD_COURSE:
      return state;
    case CREATE_SCHEDULE:
      const newSchedule = action.payload;
      return [
        ...state,
        newSchedule,
      ];
    case DELETE_SCHEDULE:
      // const filtered = action.payload.id;
      // TODO: Persist change to user data.
      // return state.filter(schedule => schedule.id !== filtered);
      return state;
    case UPDATE_SCHEDULE:
      // const scheduleId = action.payload.id;
      return {
      };
    default:
      return state;
  }
}

// function activeSchedule(state = {}, action) {
//   switch (action.type) {
    
//     default:
//       return state;
//   }
// }

/**
 * Return a list of all courses that belong to a given schedule.
 *
 * @param {string} schedule The ID of the schedule
 */
function getAllCourses(state: any, schedule: any) {

}

function getCourseById(courseId: any) {

}