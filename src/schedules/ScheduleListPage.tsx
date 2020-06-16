import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ScheduleList from './ScheduleList';
import { connect } from 'react-redux';
import { Schedule } from '../lib/types';
import { requestUserData } from './actions';

 
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
    // @ts-ignore
    this.props.loadUser(); // TODO: Ensure user is signed in
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

const mapDispatch = {
  loadUser: requestUserData,
  // loadCourses: () => ({
  //   type: LOAD_COURSES,
  // }),
  // loadCatalogs: () => ({
  //   type: LOAD_CATALOGS,
  // }),
};

export default withRouter(connect(mapStateToProps, mapDispatch)(ScheduleListPage));
