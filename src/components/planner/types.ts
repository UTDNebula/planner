import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableData } from '@dnd-kit/sortable';

// Temporary semester type
// TODO: Remove
export interface PlanSemester extends Semester {
  courses: PlanCourse[];
}

export interface PlanSemestersMap {
  [key: UniqueIdentifier]: PlanSemester;
}
// export type PlanSemestersMap = Map<UniqueIdentifier, PlanSemester>;

/* Represents a Course inside a Plan */
// export type PlanCourse = Course;
export interface PlanCourse extends Course {
  dragId: UniqueIdentifier;
}

export interface DegreeRequirementGroup {
  name: string;
  requirements: DegreeRequirement[];
}

export interface DegreeRequirement {
  name: string;
  validCourses: string[];
  courses: string[];
  hours: number;
  isfilled: boolean;
  description?: string;
}

/**
 * Data from drag event origin and destination
 * Drag origin is referred to as 'active' by @dnd-kit
 * Drag destination is referred to as 'over' by @dnd-kit
 */
export type DragEventOriginData = DragDataFromSemesterTile | DragDataFromCourseList;

export interface DragDataFromSemesterTile extends SortableData {
  from: 'semester-tile';
  semester: PlanSemester;
  course: PlanCourse;
}

export interface DragDataFromCourseList {
  from: 'course-list';
  course: PlanCourse;
}

/**
 * DestinationData can be DragDataFromSemesterTile when changing order of courses
 * - To narrow, use ``'from' in data`` or ``'to' in data``
 */
export type DragEventDestinationData = DragDataToSemesterTile | DragDataFromSemesterTile;

export interface DragDataToSemesterTile {
  to: 'semester-tile';
  semester: PlanSemester;
}

// Date stored during drag
export interface ActiveDragData {
  from: 'semester-tile' | 'course-list';
  // index: number;
  dragId: UniqueIdentifier;
  course: PlanCourse;
}

// Callbacks to generate drag and drop id's
export type GetDragIdByCourse = (course: Course) => UniqueIdentifier;

export type GetDragIdByCourseAndReq = (
  course: Course,
  requirement: DegreeRequirement,
) => UniqueIdentifier;

export type GetDragIdByCourseAndSemester = (
  course: Course,
  semester: PlanSemester,
) => UniqueIdentifier;
