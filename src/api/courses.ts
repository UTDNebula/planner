import { Course } from '../app/data';

/**
 * Load all supported courses from file.
 *
 * This maps the course objects in a course data file to a list of Course
 * objects.
 *
 * @param year The catalog year from which to load course data
 */
export async function loadCourses(year = 2020): Promise<Course[]> {
  const courseData: { [key: string]: JSONCourseType } = await import(
    `../../data/${year}-courses.json`
  );
  return Object.entries(courseData).map((value) => {
    const [catalogCode, courseData] = value;
    const { id, name: title, hours: creditHours, description } = courseData;
    return {
      id: String(id),
      title,
      catalogCode,
      description,
      creditHours: Number(creditHours),
    };
  });
}

type JSONCourseType = {
  id: number;
  name: string;
  hours: string;
  description: string;
  inclass: string;
  outclass: string;
  period: string;
  prerequisites: string[];
};
