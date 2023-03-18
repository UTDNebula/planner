/**
 * Manage user credits
 */

import type { SemesterType } from '@prisma/client';

/**
 * **A credit is considered transfer if its semester is null** \
 * **Firebase does not support 'undefined'
 */
export type Credit = {
  transfer: boolean;
  courseCode: string;
  semesterCode: {
    year: number;
    semester: SemesterType;
  };
};

/**
 * **A credit is a duplicate if**
 * - they are both transfer and count to the same UTD credit
 * - **OR**
 * - if they are both UTD credits and have the same semester
 */
const areEqual = (credit1: Credit, credit2: Credit) => {
  if (
    (!credit1.semesterCode && credit2.semesterCode) ||
    (credit1.semesterCode && !credit2.semesterCode)
  ) {
    return false;
  }

  if (!credit1.semesterCode && !credit2.semesterCode) {
    return credit1.courseCode === credit2.courseCode;
  }

  return (
    credit1.courseCode === credit2.courseCode &&
    credit1.semesterCode?.semester === credit2.semesterCode?.semester &&
    credit1.semesterCode?.year === credit2.semesterCode?.year
  );
};
