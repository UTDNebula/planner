import { CourseAttempt } from '../../auth/auth-context';
import { Grade } from '../data';

export async function loadCourseAttempts() {
  // TODO: Replace with real user data pulled from firebase
  const data = await import('../../../data/course_attempts.json');

  const courseAttemptData: CourseAttempt[] = Object.values(data['default']).map((elm, index) => {
    const { semester, grade, course } = elm;
    return { semester, grade: grade as Grade, course };
  });
  return courseAttemptData;
}
