/**
 * Custom course sort
 *
 * Array.prototype.sort() compares ASCII value of each character
 *
 * Therefore:
 * - A < B
 * - 1 < 3
 *
 * We want letters sorted in ascending order A->Z
 * We want numbers sorted in descending order 3->1
 *
 * We want the courses to be order as such:
 * - ACCT 1230
 * - BMA 3399
 * - BMA 1310
 *
 */
export const customCourseSort = <T extends { code: string }>(courses: T[]): T[] => {
  return courses.sort((course1, course2) => {
    const shorterLength =
      course1.code.length > course2.code.length ? course2.code.length : course1.code.length;

    for (let i = 0; i < shorterLength; i++) {
      const c1 = course1.code[i];
      const c2 = course2.code[i];

      const c1IsLetter = c1.match('/[a-z]/i') !== null;
      const c2IsLetter = c1.match('/[a-z]/i') !== null;

      if (c1 == c2) continue;

      if (c1IsLetter && c2IsLetter) {
        return c1 < c2 ? 1 : -1;
      } else {
        return c1 < c2 ? -1 : 1;
      }
    }

    return 1;
  });
};
