import { UniqueIdentifier } from '@dnd-kit/core';
import { SemesterCode } from '@prisma/client';
import { ObjectID } from 'bson';

// Temporary semester type
// TODO: Remove
export interface PlanSemester {
  id: ObjectID;
  code: SemesterCode;
  courses: PlanCourse[];
}

/* Represents a Course inside a Plan */
export interface PlanCourse {
  id: ObjectID;
  code: string;
  validation?: { isValid: boolean; override: boolean };
  status?: 'complete' | 'incomplete';
}

export interface PlanDegreeRequirementGroup {
  name: string;
  requirements: PlanDegreeRequirement[];
}

export interface PlanDegreeRequirement {
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

export interface DragDataFromSemesterTile {
  from: 'semester-tile';
  semester: PlanSemester;
  course: PlanCourse;
}

export interface DragDataFromCourseList {
  from: 'course-list';
  course: PlanCourse;
}

export type DragEventDestinationData = DragDataToSemesterTile;

export interface DragDataToSemesterTile {
  to: 'semester-tile';
  semester: PlanSemester;
}

// Date stored during drag
export interface ActiveDragData {
  from: 'semester-tile' | 'course-list';
  course: PlanCourse;
}

// Callbacks to generate drag and drop id's
export type GetDragIdByCourse = (course: PlanCourse) => UniqueIdentifier;

export type GetDragIdByCourseAndReq = (
  course: PlanCourse,
  requirement: PlanDegreeRequirement,
) => UniqueIdentifier;

export type GetDragIdByCourseAndSemester = (
  course: PlanCourse,
  semester: PlanSemester,
) => UniqueIdentifier;

// Toast message passed back to Planner component
export interface ToastMessage {
  message: string;
  level: 'ok' | 'warn' | 'error';
}
