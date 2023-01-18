import { SemesterType } from '@prisma/client';
import { HonorsIndicator } from './types';

/**
 * Decomposes a semster code into a year and season.
 *
 * @param semesterCode A semester identifier code like 2020f.
 */
export function convertSemesterToData(semesterCode: string): {
  year: number;
  semester: SemesterType;
} {
  // TODO: Properly validate code
  const year = Number(semesterCode.slice(0, semesterCode.length - 1));
  const semester = semesterCode.slice(semesterCode.length - 1) as SemesterType;
  return { year, semester };
}

/**
 * Human-readable labels for honors indicators.
 */
export const HONORS_INDICATOR_LABELS: { [key in HonorsIndicator]: string } = {
  /**
   * Collegium V Honors
   */
  cv: 'Collegium V Honors',

  /**
   * Computer Science Scholar
   */
  cs2: 'Computer Science Honors',

  /**
   * Liberal Arts Honors
   */
  lahc: 'Liberal Arts Honors',

  /**
   * Behavioral and Brain Sciences Honors
   */
  bbs: 'BBS Honors',

  /**
   * Arts and Humanities Honors
   */
  ah: 'A&H Honors',

  /**
   * Economic, Political & Policy Sciences Honors
   */
  epps: 'EPPS Honors',

  /**
   * Natural Sciences and Mathematics Honors
   */
  nsm: 'NSM Honors',

  /**
   * Arts & Technology Honors
   */
  atec: 'ATEC Honors',

  /**
   * Interdisciplinary Studies Honors
   */
  is: 'IS Honors',

  /**
   * No honors.
   */
  none: 'No honors',
};
