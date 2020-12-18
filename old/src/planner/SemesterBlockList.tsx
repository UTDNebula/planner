import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { ScheduleSemester } from '../lib/types';
import { RootState } from '../store/reducers';
import SemesterBlock from './SemesterBlock';
import './SemesterBlockList.css';

/**
 * A callback triggered when a semester changes order.
 */
type SemesterMovementCallback = (start: string, end: string, semesterId: string) => void;

/**
 * A callback triggered when a course changes order.
 */
type CourseMovementCallback = (start: string, end: string, courseInstanceId: string) => void;

/**
 * Component properties for a {@link ScheduleBlockList}.
 */
interface SemesterBlockListProps {
  semesters: { [key: string]: ScheduleSemester };
  enabled: boolean;
  onSemesterMoved: SemesterMovementCallback;
  onCourseMoved: CourseMovementCallback;
}

function SemesterBlockList(props: SemesterBlockListProps): JSX.Element {
  const { semesters, enabled, onCourseMoved, onSemesterMoved } = props;
  const displayedSemesters = Object.values(semesters).map((semester) => (
    <SemesterBlock key={semester.term} semester={semester} enabled={enabled} />
  ));
  // TODO: Show buttons to add semesters (like summer semester) between existing blocks.
  return <main className="semester-block-list">{displayedSemesters}</main>;
}

export default SemesterBlockList;
