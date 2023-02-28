import { trpc } from '@/utils/trpc';
import { toast } from 'react-toastify';
import { createNewYear, isSemCodeEqual } from '@/utils/utilFunctions';
import { ObjectID } from 'bson';
import { createContext, FC, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Plan, Semester, DraggableCourse } from './types';
import { customCourseSort } from './utils';
import { useTaskQueue } from '@/utils/useTaskQueue';
import { tagColors } from './utils';
import { SemesterCode } from '@prisma/client';

export interface SemestersContextState {
  planId: string;
  filteredSemesters: Semester[];
  allSemesters: Semester[];
  selectedCourseCount: number;
  bypasses: string[];
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
  handleSemesterColorChange: (color: keyof typeof tagColors, semesterId: string) => void;
  handleAddBypass: ({ planId, requirement }: { planId: string; requirement: string }) => void;
  handleRemoveBypass: ({ planId, requirement }: { planId: string; requirement: string }) => void;
  title: string;
  toggleColorFilter: (color: keyof typeof tagColors) => void;
  toggleYearFilter: (year: number) => void;
  toggleSemesterFilter: (semester: SemesterCode) => void;
  filters: Filter[];
}

type Filter =
  | { type: 'year'; year: number }
  | { type: 'color'; color: keyof typeof tagColors }
  | { type: 'semester'; code: SemesterCode };

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
  bypasses: string[];
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
    }
  | {
      type: 'changeSemesterColor';
      color: keyof typeof tagColors;
      semesterId: string;
    };

export const SemestersContextProvider: FC<SemestersContextProviderProps> = ({
  planId,
  plan,
  bypasses,
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
        case 'changeSemesterColor':
          return state.map((semester) => {
            if (semester.id.toString() !== action.semesterId) return semester;
            return { ...semester, color: action.color };
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

  const addCourse = trpc.plan.addCourseToSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate();
    },
  });

  const removeCourse = trpc.plan.removeCourseFromSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate();
    },
  });

  const moveCourse = trpc.plan.moveCourseFromSemester.useMutation();

  const createYear = trpc.plan.addYear.useMutation();

  const deleteYear = trpc.plan.deleteYear.useMutation();

  const deleteAllCourses = trpc.plan.deleteAllCoursesFromSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate();
    },
  });

  const colorChange = trpc.plan.changeCourseColor.useMutation();

  const semesterColorChange = trpc.plan.changeSemesterColor.useMutation();

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

  const handleSemesterColorChange = (color: keyof typeof tagColors, semesterId: string) => {
    dispatchSemesters({ type: 'changeSemesterColor', semesterId, color });
    addTask({
      args: { color, semesterId },
      func: ({ color, semesterId }) => semesterColorChange.mutateAsync({ color, semesterId }),
    });
  };

  const utils = trpc.useContext();
  // Add bypass for now;
  // TODO: Refactor this code smell; context should prolly include degree requirements too? or just make a separate context for it
  const addBypass = trpc.plan.addBypass.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate();
    },
  });
  const removeBypass = trpc.plan.removeBypass.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate();
    },
  });

  const handleAddBypass = ({ planId, requirement }: { planId: string; requirement: string }) => {
    addBypass.mutateAsync({ planId, requirement });
  };

  const handleRemoveBypass = ({ planId, requirement }: { planId: string; requirement: string }) => {
    removeBypass.mutateAsync({ planId, requirement });
  };

  const [filters, setFilters] = useState<Filter[]>([]);
  const toggleColorFilter = (color: keyof typeof tagColors) => {
    const hasFilter = filters.some((filter) => filter.type === 'color' && filter.color === color);
    if (!hasFilter) setFilters([...filters, { type: 'color', color }]);
    else setFilters(filters.filter((filter) => filter.type === 'color' && filter.color !== color));
  };

  const toggleYearFilter = (year: number) => {
    const hasFilter = filters.some((filter) => filter.type === 'year' && filter.year === year);
    if (!hasFilter) setFilters([...filters, { type: 'year', year }]);
    else setFilters(filters.filter((filter) => !(filter.type === 'year' && filter.year === year)));
  };

  const toggleSemesterFilter = (semesterCode: SemesterCode) => {
    const hasFilter = filters.some(
      (filter) => filter.type === 'semester' && isSemCodeEqual(filter.code, semesterCode),
    );
    if (!hasFilter) setFilters([...filters, { type: 'semester', code: semesterCode }]);
    else
      setFilters(
        filters.filter(
          (filter) => !(filter.type === 'semester' && isSemCodeEqual(filter.code, semesterCode)),
        ),
      );
  };

  const filteredSemesters = useMemo(() => {
    let filtered = sortedSemesters;
    for (const filter of filters) {
      switch (filter.type) {
        case 'year':
          const yearFilters = filters.filter((filter) => filter.type === 'year') as {
            type: 'year';
            year: number;
          }[];
          filtered = filtered.filter((semester) =>
            yearFilters.some((filter) => filter.year === semester.code.year),
          );

          break;
        case 'color':
          filtered = filtered.map((semester) => ({
            ...semester,
            courses: semester.courses.filter((course) => course.color !== filter.color),
          }));
          break;
        case 'semester':
          const semesterFilters = filters.filter((filter) => filter.type === 'semester') as {
            type: 'semester';
            code: SemesterCode;
          }[];

          filtered = filtered.filter((semester) =>
            semesterFilters.some((filter) => isSemCodeEqual(semester.code, filter.code)),
          );
      }
    }
    return filtered;
  }, [sortedSemesters, filters]);

  return (
    <SemestersContext.Provider
      value={{
        planId: plan.id,
        title: plan.name,
        allSemesters: semesters,
        filteredSemesters,
        bypasses: bypasses,
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
        handleSemesterColorChange,
        handleAddBypass,
        handleRemoveBypass,
        toggleColorFilter,
        toggleYearFilter,
        toggleSemesterFilter,
        filters,
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
    color: Object.keys(tagColors).includes(sem.color) ? (sem.color as keyof typeof tagColors) : '',
    courses: sem.courses.map((course: string, index) => ({
      id: new ObjectID(),
      code: course,
      color: Object.keys(tagColors).includes(sem.courseColors[index])
        ? (sem.courseColors[index] as keyof typeof tagColors)
        : '',
    })),
  }));
};
