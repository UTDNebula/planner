import { RecentSemester } from '../../components/planner/PlannerContainer';
import { Semester, SemesterCode } from '../common/data';

/**
 * This function generates the metadata needed
 * create a new semester inside the user plan
 * @param semesters Array of semesters obtained from the user plan
 * @returns metatdata to create a new semester
 */
export function getRecentSemesterMetadata(semesters: Semester[]) {
  const lastSemester: Semester = semesters[semesters.length - 1];
  const recentSemester: RecentSemester = {
    year: parseInt(lastSemester.code.substring(0, lastSemester.code.length - 1)),
    semester: lastSemester.code.substring(lastSemester.code.length - 1) as SemesterCode,
  };
  return recentSemester;
}
