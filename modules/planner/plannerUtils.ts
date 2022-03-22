import { RecentSemester } from "../../components/planner/PlannerContainer";
import { Semester, SemesterCode } from "../common/data";

/**
 * This function generates the metadata needed
 * create a new semester inside the user plan
 * @param semesters Array of semesters obtained from the user plan
 * @returns metatdata to create a new semester
 */
export function getRecentSemesterMetadata(semesters: Semester[]) {
  const lastSemester: Semester = semesters[semesters.length - 1];
  const recentSemester: RecentSemester = {
    year: parseInt(
      lastSemester.code.substring(0, lastSemester.code.length - 1)
    ),
    semester: lastSemester.code.substring(
      lastSemester.code.length - 1
    ) as SemesterCode,
  };
  return recentSemester;
}

/**
 * Generate metadata for adding a new semester.
 *
 * @param onlyLong Whether or not to only output long (fall/spring) semesters.
 */
export function getUpdatedSemesterData(
  recentSemesterData: RecentSemester,
  onlyLong = true
) {
  const { year, semester } = recentSemesterData;
  let updatedYear;
  let updatedSemester = semester;
  if (semester === SemesterCode.f) {
    updatedYear = year + 1;
    updatedSemester = SemesterCode.s;
  } else {
    // Semester code is either spring or summer
    updatedYear = year;
    if (onlyLong || semester === SemesterCode.s) {
      updatedSemester = SemesterCode.f;
    } else {
      updatedSemester = SemesterCode.u;
    }
  }
  return {
    year: updatedYear,
    semester: updatedSemester,
  };
}

/**
 * Move the item at the given start index to the given end index.
 *
 * @param courses The semester to reorder
 * @param startIndex The starting index of the item to move
 * @param endIndex The destination index of the item to move
 */
export function reorderSemester(
  courses: string[],
  startIndex: number,
  endIndex: number
): string[] {
  const result = Array.from(courses);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function reorderList<T>(
  list: T[],
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
