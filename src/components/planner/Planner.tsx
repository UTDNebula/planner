/**
 * Uses @dnd-kit library
 *
 * @dnd-kit heavily relies on IDs
 * No two ids under DndContext should be the same
 * All ids are generated in <PlannerTool /> (hence getId callback) and bubbled down, for clarity
 *
 * @dnd-kit allows data to be passed into drag events
 * DragEventData types meant to force typing onto drag event data
 * Be very careful when adding @dnd-kit presets (eg. @dnd-kit/sortable) or new data sources
 * Adding DndContext hooks (eg. useDraggable) without considering 'data' property will cause unexpected behaviors
 */
import { trpc } from '@/utils/trpc';
import { useTaskQueue } from '@/utils/useTaskQueue';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import CourseSelectorContainer from './Sidebar/Sidebar';
import { SidebarCourseItem } from './Sidebar/SidebarCourseItem';
import { SemesterCourseItem } from './Tiles/SemesterCourseItem';
import DroppableSemesterTile from './Tiles/SemesterTile';
import {
  ActiveDragData,
  DegreeRequirementGroup,
  DragEventDestinationData,
  DragEventOriginData,
  DraggableCourse,
  Semester,
} from './types';
import { createNewYear } from '@/utils/utilFunctions';

/** PlannerTool Props */
export interface PlannerProps {
  degreeRequirements: DegreeRequirementGroup[];
  semesters: Semester[];
  planId: string;
  setSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
}

/** Controlled wrapper around course list and semester tiles */
export default function Planner({
  degreeRequirements,
  semesters,
  setSemesters,
  planId,
}: PlannerProps): JSX.Element {
  // Course that is currently being dragged
  const [activeCourse, setActiveCourse] = useState<ActiveDragData | null>(null);

  // Delay necessary so events inside draggables propagate
  // valid sensors: https://github.com/clauderic/dnd-kit/discussions/82#discussioncomment-347608
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  // Extend Course object to contain fields for prereq validation & other stuff ig

  const utils = trpc.useContext();

  const { addTask } = useTaskQueue({ shouldProcess: true });

  const addCourse = trpc.plan.addCourseToSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const removeCourse = trpc.plan.removeCourseFromSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const moveCourse = trpc.plan.moveCourseFromSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const createYear = trpc.plan.addYear.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const deleteYear = trpc.plan.deleteYear.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const handleYearCreate = async ({ semesterIds }: { [key: string]: string[] }) => {
    try {
      await toast.promise(
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
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleYearDelete = async () => {
    try {
      // TODO: Handle deletion errors

      await toast.promise(
        deleteYear.mutateAsync(planId),
        {
          pending: 'Deleting year...',
          success: 'Year deleted!',
          error: 'Error deleting year',
        },
        {
          autoClose: 1000,
        },
      );
    } catch (error) {}
  };

  const handleAddCourse = async ({ semesterId, courseName }: { [key: string]: string }) => {
    try {
      await toast.promise(
        addCourse.mutateAsync({ planId, semesterId, courseName }),
        {
          pending: 'Adding course ' + courseName + '...',
          success: 'Added course ' + courseName + '!',
          error: 'Error in adding ' + courseName,
        },
        {
          autoClose: 1000,
        },
      );
    } catch (error) {}
  };

  const handleRemoveCourse = async ({
    semesterId: semesterId,
    courseName: courseName,
  }: {
    [key: string]: string;
  }) => {
    try {
      await toast.promise(
        removeCourse.mutateAsync({ planId, semesterId, courseName }),
        {
          pending: 'Removing course ' + courseName + '...',
          success: 'Removed course ' + courseName + '!',
          error: 'Error in removing ' + courseName,
        },
        {
          autoClose: 1000,
        },
      );
    } catch (error) {}
  };

  const handleMoveCourse = async ({
    oldSemesterId,
    newSemesterId,
    courseName,
  }: {
    [key: string]: string;
  }) => {
    try {
      await toast.promise(
        moveCourse.mutateAsync({ planId, oldSemesterId, newSemesterId, courseName }),
        {
          pending: 'Moving course ' + courseName + '...',
          success: 'Moved course ' + courseName + '!',
          error: 'Error while moving ' + courseName,
        },
        {
          autoClose: 1000,
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddYear = () => {
    const newYear: Semester[] = createNewYear(
      semesters.length ? semesters[semesters.length - 1].code : { semester: 'u', year: 2022 },
    );
    const semesterIds = newYear.map((sem) => sem.id);
    setSemesters([...semesters, ...newYear]);
    addTask({
      func: handleYearCreate,
      args: { semesterIds: semesterIds.map((id) => id.toString()) },
    });
  };

  const handleRemoveYear = () => {
    setSemesters(semesters.filter((_, idx) => idx < semesters.length - 3));
    addTask({ func: handleYearDelete, args: {} });
  };

  const handleRemoveCourseFromSemester = (
    targetSemester: Semester,
    targetCourse: DraggableCourse,
  ) => {
    setSemesters((semesters) =>
      semesters.map((semester) => {
        if (semester.id === targetSemester.id) {
          return {
            ...semester,
            courses: semester.courses.filter((course) => course.id !== targetCourse.id),
          };
        }

        return semester;
      }),
    );

    const semesterId = targetSemester.id.toString();
    const courseName = targetCourse.code;
    addTask({ func: handleRemoveCourse, args: { semesterId, courseName } });
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

    setSemesters((semesters) =>
      semesters.map((semester) =>
        semester.id === targetSemester.id
          ? { ...semester, courses: [...semester.courses, newCourse] }
          : semester,
      ),
    );
    const semesterId = targetSemester.id.toString();
    const courseName = newCourse.code;
    addTask({ func: handleAddCourse, args: { semesterId, courseName } });
  };

  const handleMoveCourseFromSemesterToSemester = (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: DraggableCourse,
  ) => {
    // check for duplicate course
    const isDuplicate = Boolean(
      destinationSemester.courses.find((course) => course.code === courseToMove.code),
    );
    if (isDuplicate) {
      toast.warn(
        `You're already taking ${courseToMove.code} in ${destinationSemester.code.year}${destinationSemester.code.semester}`,
      );
      return;
    }

    setSemesters((semesters) =>
      semesters.map((semester) => {
        if (semester.id === destinationSemester.id) {
          return { ...semester, courses: [...semester.courses, courseToMove] };
        }

        if (semester.id === originSemester.id) {
          return {
            ...semester,
            courses: semester.courses.filter((course) => course.id !== courseToMove.id),
          };
        }
        return semester;
      }),
    );

    const oldSemesterId = originSemester.id.toString();
    const newSemesterId = destinationSemester.id.toString();
    const courseName = courseToMove.code;

    addTask({ func: handleMoveCourse, args: { oldSemesterId, newSemesterId, courseName } });
  };

  return (
    <DndContext
      // Enabling autoScroll causes odd behavior when dragging outside of a scrollable container (eg. Sidebar)
      autoScroll={false}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => {
        const originData = active.data.current as DragEventOriginData;
        setActiveCourse({ from: originData.from, course: originData.course });
      }}
      onDragEnd={({ active, over }) => {
        setActiveCourse(null);

        if (active && over) {
          const originData = active.data.current as DragEventOriginData;
          const destinationData = over.data.current as DragEventDestinationData;

          // from semester -> current semester
          // attempting to drop semester course on current tile
          if (
            originData.from === 'semester-tile' &&
            destinationData.to === 'semester-tile' &&
            originData.semester.id === destinationData.semester.id
          )
            return;

          // from course list -> semester
          if (
            originData.from === 'course-list' &&
            destinationData.to === 'semester-tile'
            // onAddCourseToSemester
          ) {
            handleAddCourseToSemester(destinationData.semester, originData.course);
          }

          // from semester -> another semester
          if (originData.from === 'semester-tile' && destinationData.to === 'semester-tile') {
            handleMoveCourseFromSemesterToSemester(
              originData.semester,
              destinationData.semester,
              originData.course,
            );
          }
        }
      }}
    >
      <div className="w-full grid grid-cols-[auto_1fr] gap-[52px]">
        <CourseSelectorContainer
          degreeRequirements={degreeRequirements}
          getSearchedDragId={(course) => `course-list-searched-${course.id}`}
          getRequirementDragId={(course) => `course-list-requirement-${course.id}`}
        />
        <DragOverlay dropAnimation={null}>
          {activeCourse &&
            (activeCourse.from === 'semester-tile' ? (
              <SemesterCourseItem course={activeCourse.course} isDisabled={false} />
            ) : activeCourse.from === 'course-list' ? (
              <SidebarCourseItem course={activeCourse.course} />
            ) : null)}
        </DragOverlay>

        <div className="min-h-fit">
          <div className="grid grid-cols-3 grid-rows-4 w-fit gap-[32px]">
            {semesters.map((semester) => {
              const hasInvalidCourse =
                semester.courses.length > 0 &&
                semester.courses.some((course) => course.validation && !course.validation.isValid);

              return (
                <DroppableSemesterTile
                  onRemoveCourse={(semester, course) =>
                    handleRemoveCourseFromSemester(semester, course)
                  }
                  key={semester.id.toString()}
                  dropId={`semester-${semester.id}`}
                  getSemesterCourseDragId={(course, semester) =>
                    `semester-tile-course-${semester.id}-${course.id}`
                  }
                  semester={semester}
                  isValid={!hasInvalidCourse}
                />
              );
            })}
            <div className="col-span-full flex justify-center items-center gap-8 h-10">
              <button onClick={handleRemoveYear}>- Remove Year</button>
              <button onClick={handleAddYear}>+ Add Year</button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
