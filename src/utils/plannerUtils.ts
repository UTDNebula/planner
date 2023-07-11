import { SemesterCode } from 'prisma/utils';

import { isSemCodeEqual } from './utilFunctions';

export function formatDegreeValidationRequest(
  semesters: { id: string; courses: string[] }[],
  transferCredits: string[],
  requirements = { core: true, majors: ['computer_science'], minors: [] },
  bypasses: string[] = [],
) {
  return {
    courses: [...semesters.flatMap((s) => s.courses), ...transferCredits],
    requirements: requirements,
    bypasses,
  };
}

/**
 * Is semesterOne earlier than semesterTwo
 */
export const isEarlierSemester = (semesterOne: SemesterCode, semesterTwo: SemesterCode) => {
  if (isSemCodeEqual(semesterOne, semesterTwo)) {
    return false;
  } else if (semesterOne.year > semesterTwo.year) {
    return false;
  } else if (
    semesterOne.year === semesterTwo.year &&
    (semesterOne.semester === 'f' || (semesterOne.semester === 'u' && semesterTwo.semester === 's'))
  ) {
    return false;
  }
  return true;
};

export const getStartingPlanSemester = (): SemesterCode => {
  const d = new Date();
  if (d.getMonth() < 5) {
    return { year: d.getFullYear(), semester: 's' };
  } else if (d.getMonth() > 7) {
    return { year: d.getFullYear(), semester: 'f' };
  } else {
    return { year: d.getFullYear(), semester: 'u' };
  }
};
