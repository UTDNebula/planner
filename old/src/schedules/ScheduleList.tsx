import React from 'react';
import { Schedule } from '../store/user/types';
import ScheduleListItem, {
  ScheduleDeletionCallback,
  ScheduleSelectionCallback,
} from './ScheduleListItem';

interface ScheduleListProps {
  schedules: Array<Schedule>;
  onScheduleDeleted?: ScheduleDeletionCallback;
  onScheduleSelected?: ScheduleSelectionCallback;
}

/**
 * A list of schedule info.
 *
 * @param {object} props
 */
function ScheduleList(props: ScheduleListProps): JSX.Element {
  return (
    <div>
      {props.schedules.map((schedule: Schedule) => (
        <ScheduleListItem key={schedule.id} schedule={schedule} {...props} />
      ))}
    </div>
  );
}

export default ScheduleList;
