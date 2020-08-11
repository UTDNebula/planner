import firebase from 'firebase';
import 'firebase/app';
import 'firebase/firestore';
import { initFirebase } from '../firebase-init';
import firebaseConfig from '../../firebase-config';
import { CoursePlan } from '../types';
import { Course } from '../../store/catalog/types';
import { Student, Schedule, StudentData } from '../../store/user/types';

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
 * @return {Promise<Schedule>} The requested schedule
 */
export async function fetchSchedule(scheduleId: string): Promise<Schedule> {
  try {
    const doc = await db.doc(`${COLLECTION_SCHEDULES}/${scheduleId}`).get();
    const schedule = doc.data() as Schedule;
    return schedule;
  } catch (e) {
    throw e;
  }
}

/**
 * Download all schedules for the given user.
 *
 * @param userId The unique identifier for a user
 */
export async function fetchSchedulesForUser(userId: string): Promise<Schedule[]> {
  // TODO: Store simple schedule metadata in student.schedules ({scheduleId, name }), then fetch later based off these IDs
  try {
    const snap = await db
      .collection(COLLECTION_STUDENTS)
      .doc(userId)
      .collection(COLLECTION_SCHEDULES)
      .get();
    const schedules = snap.docs.map((doc) => doc.data() as Schedule);
    return schedules;
  } catch (e) {
    throw e;
  }
}

/**
 * Retrieve course data.
 *
 * This fetches all available courses from the database.
 *
 * @return {Promise<Course[]>} A list of all courses
 */
export async function fetchCourses(): Promise<Course[]> {
  try {
    const snap = await db.collection(COLLECTION_COURSES).get();
    const courses = snap.docs.map((doc) => doc.data() as Course);
    return courses;
  } catch (e) {
    throw e;
  }
}

/**
 * Load all available course plans.
 *
 * @return {Promise<CoursePlan[]>} A list of all course plans
 */
export async function loadCoursePlans(): Promise<CoursePlan[]> {
  try {
    const snap = await db.collection(COLLECTION_COURSE_PLAN).get();
    const coursePlans = snap.docs.map((doc) => doc.data() as CoursePlan);
    return coursePlans;
  } catch (e) {
    throw e;
  }
}

/**
 * Fetches student data from the database.
 *
 * @param {string} id The email of the user
 *
 * @return {Student} The student with the given ID
 */
export async function fetchStudent(id: string): Promise<Student> {
  try {
    const doc = await db.doc(`${COLLECTION_STUDENTS}/${id}`).get();
    const student = doc.data() as Student;
    return student;
  } catch (e) {
    throw e;
  }
}

/**
 * Fetches student data from the database.
 *
 * @param {string} id The email of the user
 *
 * @return {Student} The student with the given ID
 */
export async function fetchStudentData(id: string): Promise<StudentData> {
  try {
    const doc = await db.doc(`${COLLECTION_STUDENTS}/${id}`).get();
    const studentData = doc.data();
    if (!studentData) {
      throw new Error('Student data is undefined.');
    }
    const schedulesSnap = await db.collection(`${COLLECTION_STUDENTS}/${id}/schedules`).get();
    const schedulesData = schedulesSnap.docs.map((doc) => doc.data() as Schedule);
    const student: StudentData = {
      id: studentData['id'],
      name: studentData['name'],
      startTerm: studentData['startTerm'],
      endTerm: studentData['endTerm'],
      classification: studentData['classification'],
      attemptedCourses: studentData['attemptedCourses'],
      attemptedCreditHours: studentData['attemptedCreditHours'],
      gpa: studentData['gpa'],
      requirements: studentData['requirements'],
      // plans: [], // TODO: Update to actual schedule data
    };
    return student;
  } catch (e) {
    throw e;
  }
}

/**
 * Retrieve all the user's schedules.
 */
export async function fetchUserSchedules(userId: string): Promise<Schedule[]> {
  try {
    // const snap = await db
    //   .collection(COLLECTION_STUDENTS)
    //   .doc(userId)
    //   .collection(COLLECTION_SCHEDULES)
    //   .get();
    // const schedules = snap.docs.map((doc) => doc.data() as Schedule);
    const schedules: Schedule[] = [];
    return schedules;
  } catch (e) {
    throw e;
  }
}

/**
 * Delete a schedule from the database.
 */
export async function deleteSchedule(userId: string, scheduleId: string): Promise<void> {
  try {
    await db
      .collection(COLLECTION_STUDENTS)
      .doc(userId)
      .collection(COLLECTION_SCHEDULES)
      .doc(scheduleId)
      .delete();
  } catch (e) {
    throw e;
  }
}
