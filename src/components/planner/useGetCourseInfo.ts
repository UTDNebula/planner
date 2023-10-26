import { RouterOutputs, trpc } from '@/utils/trpc';

// TODO: Change implementation
// Highly inefficient
const useGetCourseInfo = (
  courseCode: string,
): {
  title?: string;
  description?: string;
} => {
  const { data } = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  if (data === undefined) return {};
  const title = getTitle(data, courseCode);

  // Get course description
  const courseInfo = data?.find(
    (course) => course.subject_prefix + ' ' + course.course_number === courseCode,
  );
  const description = courseInfo ? courseInfo.description : '';

  return { title, description };
};

export default useGetCourseInfo;

type CourseData = RouterOutputs['courses']['publicGetAllCourses'];

const getTitle = (courseData: CourseData, courseCode: string): string | undefined => {
  let title;
  courseData?.find(function (cNum) {
    if (cNum.subject_prefix + ' ' + cNum.course_number === courseCode) {
      title = cNum.title;
      return courseCode;
    }
  });

  return title;
};
