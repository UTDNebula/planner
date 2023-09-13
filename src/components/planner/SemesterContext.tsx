import { SemesterType } from '@prisma/client';
import { createContext, FC, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { toast } from 'react-toastify';

import { trpc } from '@/utils/trpc';
import { useTaskQueue } from '@/utils/useTaskQueue';
import { createYearBasedOnFall } from '@/utils/utilFunctions';

import { Plan, Semester, DraggableCourse } from './types';
import { customCourseSort, tagColors } from './utils';

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
  toggleSemesterFilter: (semester: SemesterType) => void;
  toggleOffAllColorFilters: () => void;
  toggleOffAllYearFilters: () => void;
  toggleOffAllSemesterFilters: () => void;
  filters: Filter[];
  handleCourseLock: (semesterId: string, locked: boolean, courseName: string) => void;
  handleSemesterLock: (semesterId: string, locked: boolean) => void;
  handleCoursePrereqOverride: (
    semesterId: string,
    prereqOverriden: boolean,
    courseName: string,
  ) => void;
}

type Filter =
  | { type: 'year'; year: number }
  | { type: 'color'; color: keyof typeof tagColors }
  | { type: 'semester'; semester: SemesterType };

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
    }
  | {
      type: 'changeCourseLock';
      locked: boolean;
      semesterId: string;
      courseName: string;
    }
  | {
      type: 'changeSemesterLock';
      locked: boolean;
      semesterId: string;
    }
  | {
      type: 'changeCoursePrereqOverride';
      prereqOverriden: boolean;
      courseName: string;
      semesterId: string;
    }
  | {
      type: 'reinitState';
      semesters: Semester[];
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
      for (const { id, code } of semester.courses) {
        const courseId = id.toString();

        if (selectedCourseIds.has(courseId)) {
          dispatchSemesters({
            type: 'removeCourseFromSemester',
            courseId,
            semesterId: semester.id.toString(),
          });
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
            args: { semesterId: semester.id.toString(), courseName: code },
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
        case 'reinitState':
          return action.semesters;

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
                }
              : semester,
          );

        case 'removeCourseFromSemester':
          return state.map((semester) => {
            return semester.id.toString() === action.semesterId
              ? {
                  ...semester,
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
              };
            }

            if (semester.id.toString() === action.originSemesterId) {
              return {
                ...semester,
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
              ? { ...semester, courses: semester.courses.filter((course) => course.locked) }
              : semester,
          );
        case 'changeCourseColor':
          return state.map((semester) => {
            if (semester.id.toString() !== action.semesterId) return semester;
            const idx = semester.courses.findIndex((course) => course.code === action.courseCode);
            semester.courses[idx].color = action.color;
            return semester;
          });
        case 'changeSemesterColor':
          return state.map((semester) => {
            if (semester.id.toString() !== action.semesterId) return semester;
            return { ...semester, color: action.color };
          });
        case 'changeCourseLock':
          return state.map((semester) => {
            if (semester.id.toString() !== action.semesterId) return semester;
            const idx = semester.courses.findIndex((course) => course.code === action.courseName);
            semester.courses[idx].locked = action.locked;
            return semester;
          });
        case 'changeSemesterLock':
          return state.map((semester) =>
            semester.id.toString() == action.semesterId
              ? { ...semester, locked: action.locked }
              : semester,
          );
        case 'changeCoursePrereqOverride':
          return state.map((semester) =>
            semester.id.toString() === action.semesterId
              ? {
                  ...semester,
                  courses: semester.courses.map((course) =>
                    course.code === action.courseName
                      ? { ...course, prereqOveridden: action.prereqOverriden }
                      : course,
                  ),
                }
              : semester,
          );
        default:
          return state;
      }
    },
    plan ? parsePlanSemestersFromPlan(plan) : [],
  );

  useEffect(() => {
    dispatchSemesters({
      type: 'reinitState',
      semesters: plan ? parsePlanSemestersFromPlan(plan) : [],
    });
  }, [plan]);

  const sortedSemesters = useMemo(
    () =>
      semesters.map((semester) => ({
        ...semester,
        courses: customCourseSort([...semester.courses]),
      })),
    [semesters],
  );

  useEffect(() => console.log('stateChange', { semesters }), [semesters]);

  const changeCourseLock = trpc.plan.changeCourseLock.useMutation();
  const changeSemesterLock = trpc.plan.changeSemesterLock.useMutation();

  const handleSemesterLock = (semesterId: string, locked: boolean) => {
    dispatchSemesters({
      type: 'changeSemesterLock',
      locked,
      semesterId,
    });

    addTask({
      func: ({ locked, semesterId }) => changeSemesterLock.mutateAsync({ locked, semesterId }),
      args: { locked, semesterId },
    });
  };

  const handleCourseLock = (semesterId: string, locked: boolean, courseName: string) => {
    handleDeselectCourses([
      semesters
        .find((s) => s.id.toString() === semesterId)
        ?.courses.find((c) => c.code === courseName)
        ?.id.toString() ?? '',
    ]);
    dispatchSemesters({
      type: 'changeCourseLock',
      locked,
      semesterId,
      courseName,
    });
    addTask({
      func: ({ locked, semesterId, courseName }) =>
        changeCourseLock.mutateAsync({ locked, semesterId, courseName }),
      args: { locked, semesterId, courseName },
    });
  };

  const changeCoursePrereqOverride = trpc.plan.changeCoursePrereqOverride.useMutation();

  const handleCoursePrereqOverride = (
    semesterId: string,
    prereqOverriden: boolean,
    courseName: string,
  ) => {
    dispatchSemesters({
      type: 'changeCoursePrereqOverride',
      courseName,
      prereqOverriden,
      semesterId,
    });

    addTask({
      func: ({ semesterId, courseName, prereqOverriden }) =>
        changeCoursePrereqOverride.mutateAsync({ semesterId, courseName, prereqOverriden }),
      args: { semesterId, courseName, prereqOverriden },
    });
  };

  const addCourse = trpc.plan.addCourseToSemester.useMutation({
    async onSuccess() {
      await utils.validator.degreeValidator.invalidate();
      utils.validator.prereqValidator.invalidate();
    },
  });

  const removeCourse = trpc.plan.removeCourseFromSemester.useMutation({
    async onSuccess() {
      await utils.validator.degreeValidator.invalidate();
      await utils.validator.prereqValidator.invalidate();
    },
  });

  const moveCourse = trpc.plan.moveCourseFromSemester.useMutation({
    async onSuccess() {
      utils.validator.prereqValidator.invalidate();
    },
  });

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
    const newYear: Semester[] = createYearBasedOnFall(
      semesters.length ? semesters[semesters.length - 1].code.year : 2022,
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
      await utils.validator.degreeValidator.invalidate();
      utils.validator.prereqValidator.invalidate();
    },
  });

  const handleAddBypass = ({ planId, requirement }: { planId: string; requirement: string }) => {
    addBypass.mutateAsync({ planId, requirement });
  };

  const handleRemoveBypass = ({ planId, requirement }: { planId: string; requirement: string }) => {
    removeBypass.mutateAsync({ planId, requirement });
  };

  const [filters, setFilters] = useState<Filter[]>([]);

  const toggleOffAllColorFilters = () =>
    setFilters(filters.filter((filter) => filter.type !== 'color'));

  const toggleOffAllYearFilters = () =>
    setFilters(filters.filter((filter) => filter.type !== 'year'));

  const toggleOffAllSemesterFilters = () =>
    setFilters(filters.filter((filter) => filter.type !== 'semester'));

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

  const toggleSemesterFilter = (semesterCode: SemesterType) => {
    const hasFilter = filters.some(
      (filter) => filter.type === 'semester' && filter.semester === semesterCode,
    );
    if (!hasFilter) setFilters([...filters, { type: 'semester', semester: semesterCode }]);
    else
      setFilters(
        filters.filter(
          (filter) => !(filter.type === 'semester' && filter.semester === semesterCode),
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
          const colorFilters = filters.filter((filter) => filter.type === 'color') as {
            type: 'color';
            color: keyof typeof tagColors;
          }[];
          filtered = filtered.filter((semester) =>
            colorFilters.some((filter) => filter.color === semester.color),
          );
          break;

        case 'semester':
          const semesterFilters = filters.filter((filter) => filter.type === 'semester') as {
            type: 'semester';
            semester: SemesterType;
          }[];

          filtered = filtered.filter((semester) =>
            semesterFilters.some((filter) => filter.semester === semester.code.semester),
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
        toggleOffAllColorFilters,
        toggleOffAllYearFilters,
        toggleOffAllSemesterFilters,
        filters,
        handleCourseLock,
        handleSemesterLock,
        handleCoursePrereqOverride,
      }}
    >
      {children}
    </SemestersContext.Provider>
  );
};

const parsePlanSemestersFromPlan = (plan: Plan): Semester[] => {
  return plan.semesters.map((sem) => ({
    locked: sem.locked,
    code: sem.semesterCode,
    id: sem.id,
    color: Object.keys(tagColors).includes(sem.color) ? (sem.color as keyof typeof tagColors) : '',
    courses: sem.courses.map(
      (course) =>
        ({
          locked: course.locked,
          id: course.id,
          color: course.color as keyof typeof tagColors,
          code: course.code,
          prereqOveridden: course.prereqOverriden,
        } as DraggableCourse),
    ),
  }));
};
