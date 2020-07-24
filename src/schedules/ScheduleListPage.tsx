import React from 'react';
import { Fab } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ScheduleList from './ScheduleList';
import { connect, ConnectedProps } from 'react-redux';
import { Schedule, StudentData } from '../store/user/types';
import { addScheduleToUser, removeSchedule, refreshSchedules } from '../store/user/thunks';
import { AppState } from '../store';
import AddIcon from '@material-ui/icons/Add';
import UserHomeAppBar from './UserHomeAppBar';
import './ScheduleListPage.css';

interface ScheduleListPageProps extends ScheduleListPageReduxProps {
  user: StudentData;
  schedules: Array<Schedule>;
}

class ScheduleListPage extends React.Component<ScheduleListPageProps & RouteComponentProps> {
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
  };

  private addDummySchedule = () => {
    console.log('Adding dummy schedule');
    this.props.uploadSchedule({
      userId: this.props.user.id,
      schedule: {
        id: 'test-' + Date.now(),
        name: 'A dummy schedule',
        owner: 'test@example.com',
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        semesters: [],
      },
    });
  };

  componentDidMount() {
    // Get schedules
    this.props.refreshSchedules(this.props.user.id); // TODO: Ensure user is signed in
  }

  render() {
    return (
      <div className="schedule-list-page--wrapper">
        <UserHomeAppBar />
        <main className="schedule-list-page--contents">
          <ScheduleList
            onScheduleDeleted={this.handleScheduleDeletion}
            schedules={this.props.schedules} 
          />
          <Fab
            className="schedule-list-page--fab"
            variant="extended"
            color="secondary"
            onClick={() => {
              this.addDummySchedule();
            }}
            >
            <AddIcon></AddIcon>
            Create schedule
          </Fab>
        </main>
      </div>
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

type ScheduleListPageReduxProps = ConnectedProps<typeof connector>;

const ConnectedScheduleListPage = connector(ScheduleListPage);

export default withRouter(ConnectedScheduleListPage);
