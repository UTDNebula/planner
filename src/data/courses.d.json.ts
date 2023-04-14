declare const courses: JSONCourse[];
export default courses;

export type RequisiteType = {
  type: string;
  options: JSONCourse[];
  required: number;
};

export type JSONCourse = {
  id: string;
  co_or_pre_requisites: RequisiteType;
  corequisites: RequisiteType;
  course_number: string;
  prerequisites: RequisiteType;
  subject_prefix: string;
  title: string;
  description: string;
};
