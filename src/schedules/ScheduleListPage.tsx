import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ScheduleList from './ScheduleList';
import { connect } from 'react-redux';
import { Schedule, StudentData } from '../store/user/types';
import { addScheduleToUser, removeSchedule, refreshSchedules } from '../store/user/thunks';
import { AppState } from '../store';

interface ScheduleListPageProps extends RouteComponentProps {
  schedules: Array<Schedule>;
}

function mapStateToProps(state: any) {
  const schedules = state.schedules || [];
  return { schedules };
}


class ScheduleListPage extends React.Component<ScheduleListPageProps> {
  
  componentDidMount() {
    // Get schedules
    this.props.refreshSchedules(this.props.user.id); // TODO: Ensure user is signed in
  }

  render() {
    return (
      <main>
        <h1>Schedules for current user</h1>
        <ScheduleList schedules={this.props.schedules}></ScheduleList>
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
