import React, { useEffect, useState } from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Schedule, StudentData } from '../store/user/types';
import { addScheduleToUser, removeSchedule, refreshSchedules } from '../store/user/thunks';
import { RootState } from '../store/reducers';
import { AppDispatch } from '../store';
import ScheduleCreationDialog from '../landing/ScheduleCreationDialog';
import ScheduleList from './ScheduleList';
import UserHomeAppBar from './UserHomeAppBar';
import './ScheduleListPage.css';

interface ScheduleListPageProps {
  user: StudentData;
  schedules: {
    [id: string]: Schedule;
  };
}

function SchedulesHome(): JSX.Element {
  const [dialogShowing, setDialogShowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, schedules } = useSelector((state: RootState) => ({
    schedules: state.schedules,
    user: state.user,
  }));
  console.log(user);
  console.log('Listed schedules');
  console.log(schedules);
  const { id } = user.data;
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(refreshSchedules(id));
    console.log('Dispatch refresh');
  }, [user]);
  const { data, error, status } = schedules;
  useEffect(() => {
    // Change loading indicator
    setIsLoading(status === 'loading' || user.loading === 'pending');
  }, [status, user.loading]);

  const history = useHistory();

  const openDialog = () => {
    setDialogShowing(true);
  };

  const handleSubmit = (name: string) => {
    // TODO: Validate schedule
    // TODO: Get ID from uploading to store instead of pre-generating
    const scheduleId = 'test-' + Date.now();
    dispatch(
      addScheduleToUser({
        schedule: {
          id: scheduleId,
          name: name,
          owner: 'test@example.com', // TODO: Use user ID
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          semesters: [],
        },
      }),
    ).then(() => {
      history.push(`/schedules/${scheduleId}`);
    });
  };

  const handleDelete = (scheduleId: string) => {
    dispatch(
      removeSchedule({
        userId: user.loading,
        scheduleId: scheduleId,
      }),
    );
  };

  const scheduleList = Object.values(data);

  return (
    <div className="schedule-list-page--wrapper">
      <UserHomeAppBar />
      <main className="schedule-list-page--contents">
        {isLoading ? <div>Loading schedules</div> : <></>}
        <div>
          <ScheduleList onScheduleDeleted={handleDelete} schedules={scheduleList} />
        </div>
        <Fab
          className="schedule-list-page--fab"
          variant="extended"
          color="secondary"
          onClick={openDialog}
        >
          <AddIcon />
          Create schedule
        </Fab>
        <ScheduleCreationDialog
          visible={dialogShowing}
          onScheduleCreated={handleSubmit}
          onDismiss={() => setDialogShowing(false)}
        />
      </main>
    </div>
  );
}

export default SchedulesHome;
