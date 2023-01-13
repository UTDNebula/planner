import { Semester } from '@/components/planner/types';
import { ObjectID } from 'bson';

export const createNewSemester = (semesters: Semester[]): Semester => {
  const lastSemesterCode = semesters[0]?.code ? semesters[semesters.length - 1]?.code : '2023s';
  let year = lastSemesterCode?.substring(0, 4);
  let season = lastSemesterCode?.substring(4, 5);
  year = season === 'f' ? (parseInt(year) + 1).toString() : year;
  season = season === 'f' ? 's' : 'f';

  const semCode = `${year}${season[0].toLowerCase()}`;

  const id = new ObjectID() as unknown as string;

  return {
    code: semCode,
    id: id,
    courses: [],
  };
};
