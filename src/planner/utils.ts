import { ScheduleSemester } from '../lib/types';

/**
 * Generates a list of empty ScheduleSemester data objects.
 *
 * This assumes that no summer semesters are being generated.
 *
 * @param n The number of semesters to generate.
 */
export function generateSemesters(n = 8): ScheduleSemester[] {
  const semesters: ScheduleSemester[] = [];
  function determineSemesterCode(input: number) {
    return input % 2 === 0 ? 'f' : 's';
  }
  const startYear = 2020;
  for (let i = 0; i <= n; ++i) {
    semesters.push({
      term: startYear + Math.ceil(i / 2) + determineSemesterCode(i),
      courses: [],
    });
  }
  return semesters;
}
