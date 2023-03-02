import { RouterOutputs } from '@/utils/trpc';
import { UniqueIdentifier } from '@dnd-kit/core';
import { SemesterCode } from '@prisma/client';
import { ObjectID } from 'bson';
import { tagColors } from './utils';

export type Plan = NonNullable<RouterOutputs['plan']['getPlanById']>['plan'];

export type DegreeValidation = NonNullable<
  RouterOutputs['validator']['degreeValidator']
>['validation'];

// Temporary semester type
// TODO: Remove
export interface Semester {
  id: ObjectID;
  code: SemesterCode;
  courses: DraggableCourse[];
  color: keyof typeof tagColors;
}

export interface Course {
  code: string;
}

/* Represents a Course inside a Plan */
export interface DraggableCourse extends Course {
  id: ObjectID;
  validation?: { isValid: boolean; override: boolean };
  status?: 'complete' | 'incomplete'; // TODO: Clean this up later once prereq is done
  taken?: boolean;
  hours?: number;
  prereqs?: string[];
  color: keyof typeof tagColors;
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

export interface DragDataFromSemesterTile {
  from: 'semester-tile';
  semester: Semester;
  course: DraggableCourse;
}

export interface DragDataFromCourseList {
  from: 'course-list';
  course: DraggableCourse;
}

export type DragEventDestinationData = DragDataToSemesterTile;

export interface DragDataToSemesterTile {
  to: 'semester-tile';
  semester: Semester;
}

// Date stored during drag
export interface ActiveDragData {
  from: 'semester-tile' | 'course-list';
  course: DraggableCourse;
}

// Callbacks to generate drag and drop id's
export type GetDragIdByCourse = (course: DraggableCourse) => UniqueIdentifier;

export type GetDragIdByCourseAndReq = (
  course: DraggableCourse,
  requirement: DegreeRequirement,
) => UniqueIdentifier;

export type GetDragIdByCourseAndSemester = (
  course: DraggableCourse,
  semester: Semester,
) => UniqueIdentifier;
