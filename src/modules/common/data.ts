import { SemesterType } from '@prisma/client';
import { ObjectID } from 'bson';

import { displaySemesterCode } from '@/components/planner/Tiles/SemesterTile';
import { Course, Semester } from '@/components/planner/types';

export function generateSemesters(
  count: number,
  startYear: number,
  startSemester: SemesterType,
  useRandom = false,
  courses: Course[] = [],
  coursesPerSemester = 5,
  onlyLong = true,
): Semester[] {
  const result = [];
  let semester = startSemester;
  let year = startYear;
  for (let i = 0; i < count; ++i) {
    const code = { year, semester };
    const newSemester = {
      id: new ObjectID(),
      title: `${displaySemesterCode({ semester, year })}`,
      code: code,
      courses: [],
    };
    result.push(newSemester);
    if (semester === SemesterType.f) {
      year = year + 1;
      semester = SemesterType.s;
    } else if (semester === SemesterType.u && onlyLong) {
      semester = SemesterType.f;
    } else {
      semester = SemesterType.u;
    }
  }

  return result;
}
