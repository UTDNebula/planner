import { Schedule } from '../store/user/types';

const KEY_SCHEDULES = 'schedules';

const KEY_USERS = 'users';

/**
 * Data type of a schedule list stored in localStorage.
 */
type ScheduleStorageType = {
  schedules: {
    [id: string]: Schedule;
  };
};

/**
 * Generate a Local Storage key for the given schedue
 */
function generateKey(userId: string, scheduleId: string) {
  return `${KEY_USERS}/${userId}/${KEY_SCHEDULES}/${scheduleId}`;
}

/**
 * Inserts a schedule into local storage.
 *
 * If a schedule already exists with a given schedule's ID, it will be
 * overwritten.
 *
 * @param userId The ID of the user to associate the given schedule
 * @param data A schedule to write to disk
 */
export function storeSchedule(userId: string, data: Schedule): void {
  const { schedules } = JSON.parse(
    localStorage.getItem(KEY_SCHEDULES) || '{ "schedules": {} }',
  ) as ScheduleStorageType;
  console.log('schedules');
  console.log(schedules);
  console.log('New schedule');
  console.log(data);
  schedules[data.id] = data;
  console.log('Schedules after adding');
  console.log(schedules);
  console.log('Schedule data');
  console.log(schedules[data.id]);
  // localStorage.setItem(generateKey(userId, data.id), JSON.stringify({ schedules }));
  localStorage.setItem(KEY_SCHEDULES, JSON.stringify({ schedules }));
}

export function loadLocalSchedule(scheduleId: string): Schedule {
  const { schedules } = JSON.parse(
    localStorage.getItem(KEY_SCHEDULES) || '{ "schedules": {} }',
  ) as ScheduleStorageType;
  return schedules[scheduleId];
}

export function loadAllSchedules(userId: string): Schedule[] {
  const { schedules } = JSON.parse(
    localStorage.getItem(KEY_SCHEDULES) || '{ "schedules": {} }',
  ) as ScheduleStorageType;
  return Object.keys(schedules).map((scheduleId) => schedules[scheduleId]);
  // .filter(schedule => schedule.)
}

export function removeSchedule(scheduleId: string) {
  const { schedules } = JSON.parse(
    localStorage.getItem(KEY_SCHEDULES) || '{ "schedules": {} }',
  ) as ScheduleStorageType;
  delete schedules[scheduleId];
  localStorage.setItem(KEY_SCHEDULES, JSON.stringify({ schedules }));
}
