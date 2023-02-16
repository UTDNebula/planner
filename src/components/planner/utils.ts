import { ObjectID } from 'bson';
import { PlanSemester, PlanSemestersMap } from './types';

export const planSemesterArrayToMap = (semesters: PlanSemester[]): PlanSemestersMap => {
  const map: PlanSemestersMap = {};
  for (const semester of semesters) {
    map[semester.id.toString()] = semester;
  }
  return map;
};

export const planSemesterMaptoSemesterArray = (semestersMap: PlanSemestersMap): Semester[] => {
  return Object.values(semestersMap);
};

/** Injects dragId's into courses */
export const semestersToPlanSemestersArray = (semesters: Semester[]): PlanSemester[] => {
  return semesters.map((semester) => ({
    ...semester,
    courses: semester.courses.map((course) => ({ ...course, dragId: new ObjectID().toString() })),
  }));
};
