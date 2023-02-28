import { RouterOutputs, trpc } from '@/utils/trpc';
import { useMemo } from 'react';

// TODO: Change implementation
// Highly inefficient
const useGetCourseInfo = (courseCode: string): { prereqs: string[] } => {
  const { data } = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const prereqs = useMemo(() => (data ? getPrereqs(data, courseCode) : []), [data]);

  return { prereqs };
};

export default useGetCourseInfo;

type CourseData = RouterOutputs['courses']['publicGetAllCourses'];

const getPrereqs = (courseData: CourseData, courseCode: string): string[] => {
  const prereqs: string[] = [];
  courseData?.find(function (cNum) {
    if (cNum.subject_prefix + ' ' + cNum.course_number === courseCode) {
      //   setTitle(cNum.title);
      (cNum.prerequisites as Record<string, any>).options.map((elem: any) => {
        if (elem.type !== 'course' && elem.type !== 'other') {
          elem.options.map((elem2: any) => {
            if (elem2.type !== 'course' && elem2.type !== 'other') {
              elem2.options.map((elem3: any) => {
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
      return courseCode;
    }
  });

  return prereqs;
};
