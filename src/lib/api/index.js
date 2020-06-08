import firebase from 'firebase';
import 'firebase/firestore';
import { initFirebase } from '../firebase-init';
import firebaseConfig from '../../firebase-config';

initFirebase(firebaseConfig);

const db = firebase.firestore();

const COLLECTION_SCHEDULES = 'schedules';

const COLLECTION_COURSES = 'courses';

const COLLECTION_COURSE_PLAN = 'coursePlans';

const COLLECTION_STUDENTS = 'students';

/**
 * Retrieves schedule data.
 *
 * @param {string} scheduleId The ID of the schedule to fetch
 * 
 * @return {import('../types').Schedule} The requested schedule
 */
async function fetchSchedule(scheduleId) {
  try {
    const doc = await db.doc(`${COLLECTION_SCHEDULES}/${scheduleId}`).get();
    const schedule = doc.data();
    return schedule;
  } catch (e) {
    // TODO: Handle exception
  }
}

async function fetchSchedulesForUser(userId) {
  // TODO: Store simple schedule metadata in student.schedules ({scheduleId, name }), then fetch later based off these IDs
  try {
    const snap = await db.collection(COLLECTION_SCHEDULES).where('owner', '==', userId).get();
    const schedules = snap.docs.map(doc => doc.data());
    return schedules;
  } catch (e) {
    // TODO: Handle exception
  }
}

/**
 * Retrieve course data.
 *
 * This fetches all available courses from the database.
 *
 * @return {Array<import('../types').Course>} A list of all courses
 */
async function fetchCourses() {
  try {
    const snap = await db.collection(COLLECTION_COURSES).get();
    const courses = snap.docs.map(doc => doc.data());
    return courses;
  } catch (e) {
    // TODO: Handle exception
  }
}

/**
 * Load all available course plans.
 *
 * @return {Array<import('../types').CoursePlan>} A list of all course plans
 */
async function loadCoursePlans() {
  try {
    const snap = await db.collection(COLLECTION_COURSE_PLAN).get();
    const coursePlans = snap.docs.map(doc => doc.data());
    return coursePlans;
  } catch (e) {
    // TODO: Handle exception
  }
}

/**
 * Fetches student data from the database.
 * 
 * @param {string} id The email of the user
 *
 * @return {import("../types").Student} The student with the given ID
 */
export async function fetchStudent(id) {
  try {
    const doc = await db.doc(`${COLLECTION_STUDENTS}/${id}`).get();
    const student = doc.data();
    return student;
  } catch (e) {
    // TODO: Handle exception
  }
}
