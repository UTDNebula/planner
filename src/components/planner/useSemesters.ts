import { ObjectID } from 'bson';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Plan, Semester } from './types';
import { customCourseSort } from './utils';

export interface useSemestersProps {
  plan?: Plan;
}

export interface useSemestersReturn {
  semesters: Semester[];
  setSemesters: Dispatch<SetStateAction<Semester[]>>;
}

const useSemesters = ({ plan }: useSemestersProps) => {
  const [semesters, setSemesters] = useState<Semester[]>(
    plan ? parsePlanSemestersFromPlan(plan) : [],
  );

  const sortedSemesters = useMemo(
    () =>
      semesters.map((semester) => ({
        ...semester,
        courses: customCourseSort([...semester.courses]),
      })),
    [semesters],
  );

  return { semesters: sortedSemesters, setSemesters };
};

export default useSemesters;

const parsePlanSemestersFromPlan = (plan: Plan): Semester[] => {
  return plan.semesters.map((sem) => ({
    code: sem.code,
    id: ObjectID.createFromHexString(sem.id),
    courses: sem.courses.map((course: string) => ({
      id: new ObjectID(),
      code: course,
    })),
  }));
};
