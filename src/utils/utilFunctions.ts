import { Semester } from '@/components/planner/types';
import { SemesterCode, SemesterType } from '@prisma/client';
import { ObjectID } from 'bson';

/**
 * Creates 3 new semesters based on given year in SemesterCode
 * Ex. 2012 -> Fall 2012, Spring 2013, Summer 2013
 * @param semesterCode
 * @returns
 */
export const createNewYear = (semesterCode: SemesterCode): Semester[] => {
  const currYear = semesterCode.year;
  const newYear = semesterCode.year + 1;

  return [
    {
      code: {
        semester: 'f' as SemesterType,
        year: currYear,
      },
      id: new ObjectID(),
      courses: [],
    },
    {
      code: {
        semester: 's' as SemesterType,
        year: newYear,
      },
      id: new ObjectID(),
      courses: [],
    },
    {
      code: {
        semester: 'u' as SemesterType,
        year: newYear,
      },
      id: new ObjectID(),
      courses: [],
    },
  ];
};
