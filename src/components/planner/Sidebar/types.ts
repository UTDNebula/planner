export type DegreeRequirements = {
  can_graduate: boolean;
  requirements: DegreeRequirement[];
};
/**
 * A DegreeRequirement is a specific requirement
 * i.e. Core Curriculum, Computer Science, Psychology
 */
export type DegreeRequirement = Requirement & {
  name: string;
  type: string;
  min_hours: number;
  requirements: RequirementGroupTypes[];
  num_fulfilled_requirements: number;
  num_requirements: number;
};

export interface Requirement {
  matcher: string;
  metadata: { [key: string]: string };
  filled: boolean;
}

export type OrRequirementGroup = Requirement & {
  matcher: 'Or';
  requirements: RequirementTypes[];
  num_requirements: number;
  num_fulfilled_requirements: number;
};
export type AndRequirementGroup = Requirement & {
  matcher: 'And';
  requirements: RequirementTypes[];
  num_requirements: number;
  num_fulfilled_requirements: number;
};

export type HoursRequirementGroup = Requirement & {
  matcher: 'Hours';
  metadata: { [key: string]: string };
  required_hours: number;
  fulfilled_hours: number;
  requirements: RequirementTypes[];
  valid_courses: { [course: string]: number };
};

export type FreeElectiveRequirementGroup = Requirement & {
  matcher: 'FreeElectives';
  required_hours: number;
  fulfilled_hours: number;
  excluded_courses: string[];
  valid_courses: { [course: string]: number };
};

export type CSGuidedElectiveGroup = Requirement & {
  matcher: 'CS Guided Electives';
  required_count: number;
  also_fulfills: CourseRequirement[];
  starts_with: string;
  fulfilled_count: number;
  valid_courses: { [course: string]: number };
};

export type SelectRequirementGroup = Requirement & {
  matcher: 'Select';
  required_count: number;
  fulfilled_count: number;
  requirements: RequirementTypes[];
};

export type BAGuidedElectives = Requirement & {
  matcher: 'BA General Business Electives';
  required_count: number;
  required_hours: number;
  fulfilled_count: number;
  fulfilled_hours: number;
  valid_courses: { [course: string]: number };
  prefix_groups: RequirementTypes[];
};
// type Requirement = { matcher: string; filled: boolean };

export type CourseRequirement = Requirement & {
  matcher: 'Course';
  course: string;
};

export type HoursRequirement = Requirement & {
  matcher: 'Hours';
  required_hours: number;
  fulfilled_hours: number;
  requirements: RequirementTypes[];
  valid_courses: { [course: string]: number };
};

/**
 * RequirementGroups are groups of requirements. A DegreeRequirement is made up of multiple RequirementGroups
 * i.e. Major Preparatory Courses, Free Electives
 */
export type RequirementGroupTypes =
  | OrRequirementGroup
  | AndRequirementGroup
  | SelectRequirementGroup
  | HoursRequirementGroup
  | FreeElectiveRequirementGroup
  | CSGuidedElectiveGroup;

export type RequirementTypes =
  | SelectRequirement
  | CourseRequirement
  | OrRequirement
  | AndRequirementGroup
  | HoursRequirement
  | PrefixBucketRequirement
  | BAGuidedElectives;

export type SelectRequirement = Requirement & {
  matcher: 'Select';
  required_count: number;
  fulfilled_count: number;
  requirements: RequirementTypes[];
};

export type OrRequirement = Requirement & {
  matcher: 'Or';
  requirements: RequirementTypes[];
  num_requirements: number;
  num_fulfilled_requirements: number;
};

export type PrefixBucketRequirement = Requirement & {
  matcher: 'Prefix';
  valid_courses: { [course: string]: number };
  prefix: string;
};
