import React from 'react';
import { Schedule } from '../store/user/types';
import { Link } from 'react-router-dom';

type ScheduleSelectionCallback = (scheduleId: string) => void;

type ScheduleDeletionCallback = ScheduleSelectionCallback;

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
  render() {
    return this.props.schedules.map((schedule: Schedule) => (
      <div key={schedule.id}>
        <h2>
          <Link to={`/schedules/${schedule.id}`}>
            {schedule.name}
          </Link>
        </h2>
        <div>
          Created: {new Date(schedule.created).toISOString()}
        </div>
        <div>Schedule ID: {schedule.id}</div>
      </div>
    ));
  }
}

export default ScheduleList;
