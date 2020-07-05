import React from 'react';
import { Schedule } from '../store/user/types';
import ScheduleListItem, {
  ScheduleDeletionCallback,
  ScheduleSelectionCallback,
} from './ScheduleListItem';

interface ScheduleListProps {
  schedules: Array<Schedule>;
  onScheduleDeleted: ScheduleDeletionCallback;
  onScheduleSelected?: ScheduleSelectionCallback;
}

/**
 * A list of schedule info.
 *
 * @param {object} props
 */
class ScheduleList extends React.Component<ScheduleListProps> {
  public render(): React.ReactNode {
    return this.props.schedules.map((schedule: Schedule) => (
      <ScheduleListItem key={schedule.id} schedule={schedule}></ScheduleListItem>
    ));
  }
}

export default ScheduleList;
