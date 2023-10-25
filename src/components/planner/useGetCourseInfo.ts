import { useMemo } from 'react';

import { RouterOutputs, trpc } from '@/utils/trpc';

const useGetCourseInfo = (
  courseId: string,
): {
  prereqs: string[];
  coreqs: string[];
  co_or_pre: string[];
  title?: string;
  description?: string;
} => {
  const { data } = trpc.courses.publicGetCourseById.useQuery(courseId, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { prereqs, coreqs, co_or_pre, title } = useMemo(
    () => (data ? getPrereqs(data) : { prereqs: [], coreqs: [], co_or_pre: [] }),
    [data],
  );

  // Get course description
  const description = useMemo(() => {
    return data ? data.description : '';
  }, [data]);

  console.log('COURSE INFO: ', {
    courseId,
    prereqs,
    coreqs,
    co_or_pre,
    title,
    description,
    extraData: data,
  });
  return { prereqs, coreqs, co_or_pre, title, description };
};

export default useGetCourseInfo;

type CourseData = RouterOutputs['courses']['publicGetCourseById'];

interface RequisiteData {
  type: string;
  class_reference: string;
  options?: RequisiteData[];
}

const getPrereqs = (
  courseData: CourseData,
): { prereqs: string[]; coreqs: string[]; co_or_pre: string[]; title?: string } => {
  const course = courseData!; // can't be null

  const getCodeById = (id: string | null) => {
    if (id === null) return '';
    const { data } = trpc.courses.publicGetCourseById.useQuery(id, {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    });
    return data?.subject_prefix + ' ' + data?.course_number;
  };

  const generateReqs = (requisites: RequisiteData[]): string[] => {
    return requisites
      .map(
        (requisiteData) =>
          requisiteData.options
            ?.map((requisite) => {
              if (requisite.type !== 'course' && requisite.options) {
                return generateReqs(requisite.options);
              } else {
                return [getCodeById(requisite.class_reference)];
              }
            })
            .flat() || [],
      )
      .flat()
      .filter((req) => req);
  };

  return {
    prereqs: generateReqs([course.prerequisites]),
    coreqs: generateReqs([course.corequisites]),
    co_or_pre: generateReqs([course.co_or_pre_requisites]),
    title: course.title,
  };
};
