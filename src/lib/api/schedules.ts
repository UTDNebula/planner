import { Schedule } from '../../store/user/types';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export async function uploadSchedule(userId: string, schedule: Schedule): Promise<void> {
  try {
    console.log('Uploading schedule to Firebase');
    // await db.collection('users').doc(userId).collection('schedules')
    // .doc(schedule.id) // TODO: Separate ID 
    // .set(schedule);
  } catch (e) {
    throw e;
  }
}