import { SemesterCode, SemesterType } from '@prisma/client';
import { ObjectID } from 'bson';

import { Semester } from '@/components/planner/types';

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

import { Course } from '@/components/planner/types';

/**
 * Load all supported courses from file.
 *
 * This maps the course objects in a course data file to a list of Course
 * objects.
 *
 * @param year The catalog year from which to load course data
 */
export async function loadDummyCourses(year = 2020): Promise<Course[]> {
  const courseData: { [key: string]: JSONCourseType } = await import(
    `../data/${year}-courses.json`
  );
  return Object.entries(courseData).map((value) => {
    const [catalogCode, courseData] = value;
    return {
      code: catalogCode,
    };
  });
}

// TODO: Write way to load data from API

export type JSONCourseType = {
  id: number;
  name: string;
  hours: string;
  description: string;
  inclass: string;
  outclass: string;
  period: string;
  prerequisites: string[];
};

export async function getAllCourses(year = 2020) {
  const courses: { [key: string]: JSONCourseType } = await import(`../data/${year}-courses.json`);
  return courses;
}

/**
 * Get the semester hour from course code
 *
 * HIST 1301 -> 3
 * */
export function getSemesterHourFromCourseCode(code: string): number | null {
  const [_, hours]: (string | undefined)[] = code.split(' ');

  const hoursNum = Number(hours);

  if (Number.isNaN(hoursNum) || hoursNum.toString().length < 2) return null;

  return Number(hoursNum.toString()[1]);
}
