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
interface SemesterBlockListProps extends SemesterBlockListReduxProps {
  semesters: ScheduleSemester[];
  enabled: boolean;
  onSemesterMoved: SemesterMovementCallback;
  onCourseMoved: CourseMovementCallback;
}

class SemesterBlockList extends React.Component<SemesterBlockListProps> {
  public render(): React.ReactNode {
    const semesters = this.props.semesters.map((semester) => (
      <SemesterBlock key={semester.term} semester={semester} enabled={this.props.enabled} />
    ));
    // TODO: Show buttons to add semesters (like summer semester) between existing blocks.
    return <main className="semester-block-list">{semesters}</main>;
  }
}

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);

/**
 * The type container for injected by react-redux.
 */
type SemesterBlockListReduxProps = ConnectedProps<typeof connector>;

const ConnectedSemesterBlockList = connector(SemesterBlockList);

export default ConnectedSemesterBlockList;
