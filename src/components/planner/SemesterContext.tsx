import { trpc } from '@/utils/trpc';
import { toast } from 'react-toastify';
import { createNewYear } from '@/utils/utilFunctions';
import { ObjectID } from 'bson';
import { createContext, FC, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Plan, Semester, DraggableCourse } from './types';
import { customCourseSort } from './utils';
import { useTaskQueue } from '@/utils/useTaskQueue';
import { tagColors } from './utils';

export interface SemestersContextState {
  semesters: Semester[];
  selectedCourseCount: number;
  courseIsSelected: (courseId: string) => boolean;
  handleSelectCourses: (courseId: string[]) => void;
  handleDeselectCourses: (courseId: string[]) => void;
  handleDeselectAllCourses: () => void;
  handleDeleteAllSelectedCourses: () => void;
  handleAddCourseToSemester: (targetSemester: Semester, newCourse: DraggableCourse) => void;
  handleMoveCourseFromSemesterToSemester: (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: DraggableCourse,
  ) => void;
  handleRemoveCourseFromSemester: (targetSemester: Semester, targetCourse: DraggableCourse) => void;
  handleAddYear: () => void;
  handleRemoveYear: () => void;
  handleDeleteAllCoursesFromSemester: (semester: Semester) => void;
  handleColorChange: (
    color: keyof typeof tagColors,
    courseName: string,
    semesterId: string,
  ) => void;
}

export const SemestersContext = createContext<SemestersContextState | null>(null);

export const useSemestersContext = (): SemestersContextState => {
  const ctx = useContext(SemestersContext);

  if (ctx === null) {
    throw new Error('SemestersContext consumers used outside provider');
  }

  return ctx;
};

export interface SemestersContextProviderProps {
  planId: string;
  plan: Plan;
}

export interface useSemestersProps {
  planId: string;
  plan?: Plan;
}

export type SemestersReducerState = Semester[];

export type SemestersReducerAction =
  | {
      type: 'addCourseToSemester';
      semesterId: string;
      newCourse: DraggableCourse;
    }
  | {
      type: 'addSemesters';
      newSemesters: Semester[];
    }
  | { type: 'removeYear' }
  | { type: 'removeCourseFromSemester'; semesterId: string; courseId: string }
  | {
      type: 'moveCourseFromSemesterToSemester';
      originSemesterId: string;
      destinationSemesterId: string;
      course: DraggableCourse;
    }
  | {
      type: 'deleteAllCoursesFromSemester';
      semesterId: string;
    }
  | {
      type: 'changeCourseColor';
      courseCode: string;
      color: keyof typeof tagColors;
      semesterId: string;
    };

export const SemestersContextProvider: FC<SemestersContextProviderProps> = ({
  planId,
  plan,
  children,
}) => {
  const { addTask } = useTaskQueue({ shouldProcess: true });

  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());

  const handleSelectCourses = (courseIds: string[]) => {
    setSelectedCourseIds((existingCourseIds) => {
      const newSet = new Set(existingCourseIds);
      courseIds.forEach((courseId) => newSet.add(courseId));
      return newSet;
    });
  };

  const handleDeselectCourses = (courseIds: string[]) => {
    setSelectedCourseIds((existingCourseIds) => {
      const newSet = new Set(existingCourseIds);
      courseIds.forEach((courseId) => newSet.delete(courseId));
      return newSet;
    });
  };

  const handleDeleteAllSelectedCourses = () => {
    for (const semester of semesters) {
      for (const { id } of semester.courses) {
        const courseId = id.toString();

        if (selectedCourseIds.has(courseId)) {
          dispatchSemesters({
            type: 'removeCourseFromSemester',
            courseId,
            semesterId: semester.id.toString(),
          });
        }
      }
    }

    setSelectedCourseIds(new Set());
  };

  const courseIsSelected = (courseId: string): boolean => selectedCourseIds.has(courseId);

  const handleDeselectAllCourses = () => setSelectedCourseIds(new Set());

  const [semesters, dispatchSemesters] = useReducer<
    (state: SemestersReducerState, action: SemestersReducerAction) => Semester[]
  >(
    (state, action) => {
      switch (action.type) {
        case 'addSemesters':
          return [...state, ...action.newSemesters];

        case 'removeYear':
          return [...state].slice(0, state.length - 3);

        case 'addCourseToSemester':
          return state.map((semester) =>
            semester.id.toString() === action.semesterId
              ? {
                  ...semester,
                  courses: [...semester.courses, action.newCourse],
                  courseColors: [...semester.courseColors, ''],
                }
              : semester,
          );

        case 'removeCourseFromSemester':
          return state.map((semester) => {
            const courseColors = semester.courseColors.slice();
            courseColors.splice(
              semester.courses.findIndex((course) => course.id.toString() === action.courseId),
              1,
            );
            return semester.id.toString() === action.semesterId
              ? {
                  ...semester,
                  courseColors,
                  courses: semester.courses.filter(
                    (course) => course.id.toString() !== action.courseId,
                  ),
                }
              : semester;
          });

        case 'moveCourseFromSemesterToSemester':
          return state.map((semester) => {
            if (semester.id.toString() === action.destinationSemesterId) {
              const oldSem = state.find(
                (s) => action.originSemesterId.toString() === s.id.toString(),
              );
              if (!oldSem) return semester;
              return {
                ...semester,
                courses: [...semester.courses, action.course],
                courseColors: [
                  ...semester.courseColors,
                  oldSem.courseColors[
                    oldSem.courses.findIndex((c) => c.code === action.course.code)
                  ],
                ],
              };
            }

            if (semester.id.toString() === action.originSemesterId) {
              const courseColors = semester.courseColors.slice();
              courseColors.splice(
                semester.courses.findIndex(
                  (course) => course.id.toString() === action.course.id.toString(),
                ),
                1,
              );
              return {
                ...semester,
                courseColors,
                courses: semester.courses.filter(
                  (course) => course.id.toString() !== action.course.id.toString(),
                ),
              };
            }

            return semester;
          });

        case 'deleteAllCoursesFromSemester':
          return state.map((semester) =>
            semester.id.toString() === action.semesterId
              ? { ...semester, courses: [], courseColors: [] }
              : semester,
          );
        case 'changeCourseColor':
          return state.map((semester) => {
            if (semester.id.toString() !== action.semesterId) return semester;
            const courseColors = semester.courseColors.slice();
            const idx = semester.courses.findIndex((course) => course.code === action.courseCode);
            console.log({ idx }, action.courseCode, semester.courses, semester.courseColors);
            courseColors[idx] = action.color;
            semester.courses[idx].color = action.color;
            return {
              ...semester,
              courseColors,
            };
          });
        default:
          return state;
      }
    },
    plan ? parsePlanSemestersFromPlan(plan) : [],
  );

  const sortedSemesters = useMemo(
    () =>
      semesters.map((semester) => ({
        ...semester,
        courses: customCourseSort([...semester.courses]),
      })),
    [semesters],
  );

  useEffect(() => console.log('stateChange', { semesters }), [semesters]);

  const addCourse = trpc.plan.addCourseToSemester.useMutation();

  const removeCourse = trpc.plan.removeCourseFromSemester.useMutation();

  const moveCourse = trpc.plan.moveCourseFromSemester.useMutation();

  const createYear = trpc.plan.addYear.useMutation();

  const deleteYear = trpc.plan.deleteYear.useMutation();

  const deleteAllCourses = trpc.plan.deleteAllCoursesFromSemester.useMutation();

  const colorChange = trpc.plan.changeCourseColor.useMutation();

  const handleDeleteAllCoursesFromSemester = (semester: Semester) => {
    handleDeselectCourses(semester.courses.map((course) => course.id.toString()));

    dispatchSemesters({ type: 'deleteAllCoursesFromSemester', semesterId: semester.id.toString() });

    addTask({
      func: ({ semesterId }) => deleteAllCourses.mutateAsync({ semesterId }),
      args: { semesterId: semester.id.toString() },
    });
  };

  const handleAddYear = () => {
    const newYear: Semester[] = createNewYear(
      semesters.length ? semesters[semesters.length - 1].code : { semester: 'u', year: 2022 },
    );
    const semesterIds = newYear.map((sem) => sem.id);

    dispatchSemesters({ type: 'addSemesters', newSemesters: newYear });

    addTask({
      func: ({ semesterIds }) =>
        toast.promise(
          createYear.mutateAsync({
            planId,
            semesterIds: semesterIds.map((id) => id),
          }),
          {
            pending: 'Creating year...',
            success: 'Year created!',
            error: 'Error creating year',
          },
          {
            autoClose: 1000,
            position: 'bottom-right',
          },
        ),
      args: { semesterIds: semesterIds.map((id) => id.toString()) },
    });
  };

  const handleRemoveYear = () => {
    dispatchSemesters({ type: 'removeYear' });

    addTask({
      func: () =>
        toast
          .promise(
            deleteYear.mutateAsync(planId),
            {
              pending: 'Deleting year...',
              success: 'Year deleted!',
              error: 'Error deleting year',
            },
            {
              autoClose: 1000,
              position: 'bottom-right',
            },
          )
          .catch((err) => console.error(err)),
      args: {},
    });
  };

  const handleRemoveCourseFromSemester = (
    targetSemester: Semester,
    targetCourse: DraggableCourse,
  ) => {
    dispatchSemesters({
      type: 'removeCourseFromSemester',
      courseId: targetCourse.id.toString(),
      semesterId: targetSemester.id.toString(),
    });

    const semesterId = targetSemester.id.toString();
    const courseName = targetCourse.code;

    addTask({
      func: ({ semesterId, courseName }) =>
        toast
          .promise(
            removeCourse.mutateAsync({ planId, semesterId, courseName }),
            {
              pending: 'Removing course ' + courseName + '...',
              success: 'Removed course ' + courseName + '!',
              error: 'Error in removing ' + courseName,
            },
            {
              autoClose: 1000,
              position: 'bottom-right',
            },
          )
          .catch((err) => console.error(err)),
      args: { semesterId, courseName },
    });
  };

  const handleAddCourseToSemester = (targetSemester: Semester, newCourse: DraggableCourse) => {
    // check for duplicate course
    const isDuplicate = Boolean(
      targetSemester.courses.find((course) => course.code === newCourse.code),
    );
    if (isDuplicate) {
      toast.warn(
        `You're already taking ${newCourse.code} in ${targetSemester.code.year}${targetSemester.code.semester}`,
        {
          position: 'bottom-right',
        },
      );
      return;
    }

    const semesterId = targetSemester.id.toString();
    const courseName = newCourse.code;

    dispatchSemesters({ type: 'addCourseToSemester', semesterId, newCourse });

    addTask({
      func: ({ semesterId, courseName }) =>
        toast.promise(
          addCourse.mutateAsync({ planId, semesterId, courseName }),
          {
            pending: 'Adding course ' + courseName + '...',
            success: 'Added course ' + courseName + '!',
            error: 'Error in adding ' + courseName,
          },
          {
            position: 'bottom-right',
            autoClose: 1000,
          },
        ),
      args: { semesterId, courseName },
    });
  };

  const handleMoveCourseFromSemesterToSemester = (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: DraggableCourse,
  ) => {
    const isDuplicate = Boolean(
      destinationSemester.courses.find((course) => course.code === courseToMove.code),
    );
    if (isDuplicate) {
      toast.warn(
        `You're already taking ${courseToMove.code} in ${originSemester.code.year}${destinationSemester.code.semester}`,
        {
          position: 'bottom-right',
        },
      );
      return;
    }

    const oldSemesterId = originSemester.id.toString();
    const newSemesterId = destinationSemester.id.toString();
    const courseName = courseToMove.code;

    dispatchSemesters({
      type: 'moveCourseFromSemesterToSemester',
      originSemesterId: oldSemesterId,
      destinationSemesterId: newSemesterId,
      course: courseToMove,
    });

    addTask({
      func: ({ courseName, newSemesterId, oldSemesterId }) =>
        toast
          .promise(
            moveCourse.mutateAsync({ planId, oldSemesterId, newSemesterId, courseName }),
            {
              pending: 'Moving course ' + courseName + '...',
              success: 'Moved course ' + courseName + '!',
              error: 'Error while moving ' + courseName,
            },
            {
              autoClose: 1000,
              position: 'bottom-right',
            },
          )
          .catch((err) => console.error(err)),
      args: { oldSemesterId, newSemesterId, courseName },
    });
  };

  const handleColorChange = (
    color: keyof typeof tagColors,
    courseName: string,
    semesterId: string,
  ) => {
    dispatchSemesters({ type: 'changeCourseColor', courseCode: courseName, semesterId, color });
    addTask({
      args: { color, courseName, semesterId },
      func: ({ color, courseName, semesterId }) =>
        colorChange.mutateAsync({ color, courseName, semesterId, planId }),
    });
  };

  return (
    <SemestersContext.Provider
      value={{
        semesters: sortedSemesters,
        selectedCourseCount: selectedCourseIds.size,
        courseIsSelected,
        handleSelectCourses,
        handleDeselectCourses,
        handleDeselectAllCourses,
        handleDeleteAllSelectedCourses,
        handleAddCourseToSemester,
        handleAddYear,
        handleMoveCourseFromSemesterToSemester,
        handleRemoveCourseFromSemester,
        handleRemoveYear,
        handleDeleteAllCoursesFromSemester,
        handleColorChange,
      }}
    >
      {children}
    </SemestersContext.Provider>
  );
};

const parsePlanSemestersFromPlan = (plan: Plan): Semester[] => {
  return plan.semesters.map((sem) => ({
    code: sem.code,
    id: new ObjectID(sem.id),
    courseColors: sem.courseColors,
    courses: sem.courses.map((course: string, index) => ({
      id: new ObjectID(),
      code: course,
      color: Object.keys(tagColors).includes(sem.courseColors[index])
        ? (sem.courseColors[index] as keyof typeof tagColors)
        : '',
    })),
  }));
};
