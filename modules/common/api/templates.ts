export async function getAllCourses(year = 2020) {
  const courses: { [key: string]: JSONCourseType } = await import(
    `../../../data/${year}-courses.json`
  );
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
