import { Course } from "../data";

/**
 * Load all supported courses from file.
 *
 * This maps the course objects in a course data file to a list of Course
 * objects.
 *
 * @param year The catalog year from which to load course data
 */
export async function loadDummyCourses(year = 2020): Promise<Course[]> {
  const courseData: { [key: string]: JSONCourseType } = await import(
    `../../../data/${year}-courses.json`
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

export async function loadCourses(): Promise<Course[]> {
  const courses = await fetch("https://api.utdnebula.com/course/search")
    .then((res) => res.json())
    .then((data) => {
      return data.map((course) => {
        const {
          _id,
          title,
          credit_hours,
          description,
          subject_prefix,
          course_number,
        } = course;
        const catalogCode = subject_prefix + " " + course_number;
        return {
          id: _id,
          title,
          creditHours: credit_hours,
          description,
          catalogCode,
        };
      });
    })
    .catch((_error) => alert("An error has occured"));

  return courses;
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
