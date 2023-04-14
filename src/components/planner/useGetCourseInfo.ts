import { RouterOutputs, trpc } from '@/utils/trpc';
import { useMemo } from 'react';

// TODO: Change implementation
// Highly inefficient
const useGetCourseInfo = (
  courseCode: string,
): {
  prereqs: string[];
  coreqs: string[];
  co_or_pre: string[];
  title?: string;
  description?: string;
} => {
  const { data } = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { prereqs, coreqs, co_or_pre, title } = useMemo(
    () => (data ? getPrereqs(data, courseCode) : { prereqs: [], coreqs: [], co_or_pre: [] }),
    [data, courseCode],
  );

  // Get course description
  const description = useMemo(() => {
    const courseInfo = data?.find(
      (course) => course.subject_prefix + ' ' + course.course_number === courseCode,
    );

    return courseInfo ? courseInfo.description : '';
  }, [data, courseCode]);

  return { prereqs, coreqs, co_or_pre, title, description };
};

export default useGetCourseInfo;

type CourseData = RouterOutputs['courses']['publicGetAllCourses'];

const getPrereqs = (
  courseData: CourseData,
  courseCode: string,
): { prereqs: string[]; coreqs: string[]; co_or_pre: string[]; title?: string } => {
  const prereqs: string[] = [];
  const coreqs: string[] = [];
  const co_or_pre: string[] = [];

  let title;
  courseData?.find(function (cNum) {
    if (cNum.subject_prefix + ' ' + cNum.course_number === courseCode) {
      title = cNum.title;

      (cNum.prerequisites as Record<string, any>).options.map((elem: any) => {
        if (elem.type !== 'course' && elem.type !== 'other' && elem.options) {
          elem.options.map((elem2: any) => {
            if (elem2.type !== 'course' && elem2.type !== 'other') {
              elem2.options?.map((elem3: any) => {
                courseData?.map((elem4) => {
                  if (elem4.id === elem3.class_reference) {
                    prereqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
                  }
                });
              });
            } else if (elem2.type === 'other') {
              prereqs.push(elem2.description);
            } else {
              courseData?.map((elem4) => {
                if (elem4.id === elem2.class_reference) {
                  prereqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
                }
              });
            }
          });
        } else if (elem.type === 'other') {
          prereqs.push(elem.description);
        } else {
          courseData?.map((elem4) => {
            if (elem4.id === elem.class_reference) {
              prereqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
            }
          });
        }
      });
      (cNum.corequisites as Record<string, any>).options.map((elem: any) => {
        if (elem.type !== 'course' && elem.type !== 'other' && elem.options) {
          elem.options.map((elem2: any) => {
            if (elem2.type !== 'course' && elem2.type !== 'other') {
              elem2.options?.map((elem3: any) => {
                courseData?.map((elem4) => {
                  if (elem4.id === elem3.class_reference) {
                    coreqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
                  }
                });
              });
            } else if (elem2.type === 'other') {
              coreqs.push(elem2.description);
            } else {
              courseData?.map((elem4) => {
                if (elem4.id === elem2.class_reference) {
                  coreqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
                }
              });
            }
          });
        } else if (elem.type === 'other') {
          coreqs.push(elem.description);
        } else {
          courseData?.map((elem4) => {
            if (elem4.id === elem.class_reference) {
              coreqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
            }
          });
        }
      });
      (cNum.co_or_pre_requisites as Record<string, any>).options.map((elem: any) => {
        if (elem.type !== 'course' && elem.type !== 'other' && elem.options) {
          elem.options.map((elem2: any) => {
            if (elem2.type !== 'course' && elem2.type !== 'other') {
              elem2.options?.map((elem3: any) => {
                courseData?.map((elem4) => {
                  if (elem4.id === elem3.class_reference) {
                    co_or_pre.push(elem4.subject_prefix + ' ' + elem4.course_number);
                  }
                });
              });
            } else if (elem2.type === 'other') {
              co_or_pre.push(elem2.description);
            } else {
              courseData?.map((elem4) => {
                if (elem4.id === elem2.class_reference) {
                  co_or_pre.push(elem4.subject_prefix + ' ' + elem4.course_number);
                }
              });
            }
          });
        } else if (elem.type === 'other') {
          co_or_pre.push(elem.description);
        } else {
          courseData?.map((elem4) => {
            if (elem4.id === elem.class_reference) {
              co_or_pre.push(elem4.subject_prefix + ' ' + elem4.course_number);
            }
          });
        }
      });
      return courseCode;
    }
  });

  return { prereqs, coreqs, co_or_pre, title };
};
