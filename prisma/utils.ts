import { Profile, SemesterType } from '@prisma/client';

export type SemesterCode = {
  year: number;
  semester: SemesterType;
};

export type WithSemesterCode<T> = T & { semesterCode: SemesterCode };

export const computeSemesterCode = <T extends { year: number; semester: SemesterType }>(
  type: T,
): WithSemesterCode<T> => {
  return {
    ...type,
    semesterCode: {
      year: type.year,
      semester: type.semester,
    },
  };
};

export type WithStartAndEndSemesterCode<T> = T & {
  startSemesterCode: SemesterCode;
  endSemesterCode: SemesterCode;
};

export const computeProfileWithSemesterCode = (
  profile: Profile,
): WithStartAndEndSemesterCode<Profile> => {
  return {
    ...profile,
    startSemesterCode: {
      year: profile.startYear,
      semester: profile.startSemester,
    },
    endSemesterCode: {
      year: profile.endYear,
      semester: profile.endSemester,
    },
  };
};
