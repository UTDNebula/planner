import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ScheduleList from './ScheduleList';
import { connect } from 'react-redux';
import { Schedule, StudentData } from '../store/user/types';
import { addScheduleToUser, removeSchedule, refreshSchedules } from '../store/user/thunks';
import { AppState } from '../store';

interface ScheduleListPageProps extends RouteComponentProps {
  user: StudentData;
  schedules: Array<Schedule>;
  uploadSchedule: Function;
  deleteSchedule: Function;
  refreshSchedules: Function;
}

class ScheduleListPage extends React.Component<ScheduleListPageProps> {

  /**
   * Trigger a database deletion.
   *
   * @param id The ID of the schedule being deleted.
   */
  private handleScheduleDeletion = (scheduleId: string) => {
    this.props.deleteSchedule({
      userId: this.props.user.id,
      scheduleId: scheduleId,
    });
  }

  private addDummySchedule = () => {
    console.log('Adding dummy schedule');
    this.props.uploadSchedule({
      userId: this.props.user.id,
      schedule: {
        id: 'test-' + Date.now(),
        name: 'A dummy schedule',
        owner: 'test@example.com',
        created: Date.now(),
        lastUpdated: Date.now(),
        semesters: [],
      },
    });
  }

  componentDidMount() {
    // Get schedules
    this.props.refreshSchedules(this.props.user.id); // TODO: Ensure user is signed in
  }

  render() {
    return (
      <main>
        <h1>Schedules for current user</h1>
        <button onClick={() => {
          this.addDummySchedule();
        }}>Create dummy schedule</button>
        <ScheduleList onScheduleDeleted={this.handleScheduleDeletion} schedules={this.props.schedules}></ScheduleList>
      </main>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    user: state.user.data,
    schedules: state.schedules,
  };
}

const mapDispatch = {
  refreshSchedules: refreshSchedules,
  uploadSchedule: addScheduleToUser,
  deleteSchedule: removeSchedule,
};

const connector = connect(mapStateToProps, mapDispatch);

const ConnectedScheduleListPage = connector(ScheduleListPage);

export default withRouter(ConnectedScheduleListPage);
