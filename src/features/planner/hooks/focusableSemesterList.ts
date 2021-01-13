import React from 'react';
import { Semester } from '../../../app/data';

/**
 * A hook to conslidate focusability for semesters.
 *
 * @param semesters The current semester list state
 * @param initialFocused The ID of the currently focused semester
 */
export function useFocusableSemesterList(semesters: Semester[], initialFocused = '') {
  const [focusedSemester, setFocusedSemester] = React.useState(initialFocused);

  /**
   * Focuses on a selected semester.
   *
   * @param semesterCode The identifier of the selected semester
   */
  const handleSemesterSelection = (semesterCode: string) => {
    console.log('Semester selected: ' + semesterCode);
    setFocusedSemester(semesterCode);
  };

  const navSemesterData = semesters.map((semester) => {
    return {
      code: semester.code,
      title: semester.title,
    };
  });

  return {
    focusedSemester,
    navSemesterData,
    handleSemesterSelection,
  };
}
