import React from 'react';
import { Schedule } from '../lib/types';
import { Link } from 'react-router-dom';

interface ScheduleListProps {
  schedules: Array<Schedule>;
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
            Schedule Name: {schedule.name}
          </Link>
        </h2>
        <div>Schedule ID: {schedule.id}</div>
      </div>
    ));
  }
}

export default ScheduleList;
