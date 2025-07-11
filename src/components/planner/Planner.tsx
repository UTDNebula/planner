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
import {
  Active,
  DndContext,
  DragOverlay,
  Over,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Router from 'next/router';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { trpc } from '@/utils/trpc';

import PlannerMouseSensor from './PlannerMouseSensor';
import SelectedCoursesToast from './SelectedCoursesToast';
import { useSemestersContext } from './SemesterContext';
import Sidebar from './Sidebar/Sidebar';
import { SidebarCourseItem } from './Sidebar/SidebarCourseItem';
import { SemesterCourseItem } from './Tiles/SemesterCourseItem';
import DroppableSemesterTile from './Tiles/SemesterTile';
import Toolbar from './Toolbar/Toolbar';
import TransferBank from './TransferBank';
import type {
  ActiveDragData,
  DragEventDestinationData,
  DragEventOriginData,
  Semester,
} from './types';

/** PlannerTool Props */
export interface PlannerProps {
  degreeRequirementsData: { id: string; major: string };
  prereqData?: Map<string, boolean>;
  transferCredits: Array<string>;
}

/** Controlled wrapper around course list and semester tiles */

/** Controlled wrapper around course list and semester tiles */
export default function Planner({ degreeRequirementsData, transferCredits }: PlannerProps) {
  const {
    planId,
    filteredSemesters,
    handleAddCourseToSemester,
    handleMoveCourseFromSemesterToSemester,
    selectedCourseCount,
    handleDeselectAllCourses,
    handleSelectCourses,
    handleDeleteAllSelectedCourses,
    handleRemoveCourseFromSemester,
    title,
    undo,
  } = useSemestersContext();

  const utils = trpc.useContext();

  const userQuery = trpc.user.getUser.useQuery();
  const { data: userData } = userQuery;

  // Hacky
  const updatePlan = async () => {
    await utils.user.getUser.invalidate();
  };

  const [deleteLoading, setDeleteLoading] = useState(false);

  const deletePlan = trpc.plan.deletePlanById.useMutation({
    onSuccess: () => {
      utils.plan.invalidate().then(() => Router.push('/app/home'));
    },
    onSettled: () => setDeleteLoading(false),
  });

  useEffect(() => {
    updatePlan();
  }, [filteredSemesters]);

  // Course that is currently being dragged
  const [activeCourse, setActiveCourse] = useState<ActiveDragData | null>(null);

  // Controls drag locking for the sidebar
  const [isCourseDragging, setIsCourseDragging] = useState(false);

  // Delay necessary so events inside draggables propagate
  // valid sensors: https://github.com/clauderic/dnd-kit/discussions/82#discussioncomment-347608
  const sensors = useSensors(
    useSensor(PlannerMouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const courseCodes = useMemo(
    () => filteredSemesters.flatMap((sem) => sem.courses).map((course) => course.code),
    [filteredSemesters],
  );

  const courseIds = useMemo(
    () => filteredSemesters.flatMap((sem) => sem.courses).map((course) => course.id.toString()),
    [filteredSemesters],
  );

  const handleOnDragStart = ({ active }: { active: Active }) => {
    const originData = active.data.current as DragEventOriginData;
    setActiveCourse({
      from: originData.from,
      course: originData.course,
    });
    setIsCourseDragging(true);
  };

  const handleOnDragEnd = ({ active, over }: { active: Active; over: Over | null }) => {
    setActiveCourse(null);

    if (active && over) {
      const originData = active.data.current as DragEventOriginData;
      const destinationData = over.data.current as DragEventDestinationData;

      // from course list -> semester
      if (originData.from === 'course-list' && destinationData.to === 'semester-tile') {
        handleAddCourseToSemester(destinationData.semester, originData.course);
      }

      // from semester -> another semester
      if (
        originData.from === 'semester-tile' &&
        destinationData.to === 'semester-tile' &&
        originData.semester.id !== destinationData.semester.id
      ) {
        handleMoveCourseFromSemesterToSemester(
          originData.semester,
          destinationData.semester,
          originData.course,
        );
      }
      // from semester to sidebar drag and drop deletion
      if (originData.from === 'semester-tile' && destinationData.to === 'sidebar-tile') {
        handleRemoveCourseFromSemester(originData.semester, originData.course);
      }
    }

    setIsCourseDragging(false);
  };

  const ref = useRef<HTMLDivElement>(null);
  // TODO: Use resizeobserver to change column count based on screen size

  useHotkeys('ctrl+z', undo);

  return (
    <DndContext
      autoScroll={true}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
    >
      <SelectedCoursesToast
        show={selectedCourseCount > 0}
        selectedCount={selectedCourseCount}
        areAllCoursesSelected={selectedCourseCount === courseIds.length}
        deleteSelectedCourses={handleDeleteAllSelectedCourses}
        deselectAllCourses={handleDeselectAllCourses}
        selectAllCourses={() => handleSelectCourses(courseIds)}
      />
      <div className="flex h-screen flex-row">
        <DragOverlay dropAnimation={null}>
          {activeCourse &&
            (activeCourse.from === 'semester-tile' ? (
              <SemesterCourseItem course={activeCourse.course} isDragging isValid />
            ) : activeCourse.from === 'course-list' ? (
              <SidebarCourseItem course={activeCourse.course} isDragging />
            ) : null)}
        </DragOverlay>

        <section
          ref={ref}
          className="flex max-h-screen grow flex-col gap-y-6 overflow-y-scroll p-4 pb-0"
        >
          <Toolbar
            planId={planId}
            title={title}
            degreeRequirements={{
              ...degreeRequirementsData,
              major: degreeRequirementsData?.major ?? 'undecided',
            }}
            transferCredits={transferCredits}
            studentName={userData?.profile?.name ?? 'Student'}
            deletePlan={() => {
              setDeleteLoading(true);
              deletePlan.mutateAsync(planId);
            }}
            deleteLoading={deleteLoading}
          />

          <article className="flex h-full  flex-col gap-y-5 overflow-x-hidden pb-8">
            {transferCredits.length > 0 && <TransferBank transferCredits={transferCredits} />}
            <div className="flex h-fit gap-5">
              {filteredSemesters
                .reduce(
                  (acc, curr, index) => {
                    acc[index % 3].push(curr);
                    return acc as Semester[][];
                  },
                  [[], [], []] as Semester[][],
                )
                .map((column, index) => (
                  <MasonryColumn key={`column-${index}`} column={column} />
                ))}
            </div>
          </article>
        </section>
        <Sidebar
          planId={planId}
          courses={courseCodes}
          transferCredits={transferCredits}
          getSearchedDragId={(course) => `course-list-searched-${course.id}`}
          getRequirementDragId={(course) => `course-list-requirement-${course.id}`}
          courseDragged={isCourseDragging}
          dropId={`semester-tile-course-${activeCourse?.course}`}
          dragActive={activeCourse?.from === 'semester-tile'}
        />
      </div>
    </DndContext>
  );
}

const MasonryColumn: FC<{ column: Semester[] }> = ({ column }) => {
  return (
    <div className="flex w-[calc(33%-10px)] flex-col gap-5">
      {column.map((semester) => {
        return (
          <DroppableSemesterTile
            key={semester.id.toString()}
            dropId={`semester-${semester.id}`}
            getSemesterCourseDragId={(course, semester) =>
              `semester-tile-course-${semester.id}-${course.id}`
            }
            semester={semester}
          />
        );
      })}
    </div>
  );
};
