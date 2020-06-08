import React from 'react';
import { Link } from 'react-router-dom';

export default class ScheduleListPage extends React.Component {
  render() {
    const schedules = this.props.schedules.map(schedule => (
      <div key={schedule.id}>
        <h1>
          <Link to={`/schedules/${schedule.id}`}>
            Schedule Name: {schedule.name}
          </Link>
        </h1>
        Schedule ID: {schedule.id}
      </div>
    ));
    return (
      <main>
        {schedules}
      </main>
    );
  }
}