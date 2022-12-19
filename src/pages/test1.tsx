import {
  DndContext,
  DragOverlay,
  pointerWithin,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NextPage } from 'next';
import React, { FC, useMemo, useState } from 'react';
import {} from 'react-dom';

type Semester = {
  id: string;
  name: string;
  courses: string[];
};

type Course = {
  id: string;
  name: string;
};

interface DroppableSemesterProps {
  id: UniqueIdentifier;
  semester: Semester;
}

const DroppableSemesterItem: FC<DroppableSemesterProps> = ({ id, semester }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <SemesterItem ref={setNodeRef} isOver={isOver} semester={semester} />;
};

interface SemesterItemProps {
  semester: Semester;
  isOver?: boolean;
}

const SemesterItem = React.forwardRef<HTMLDivElement, SemesterItemProps>(function SemesterItem(
  { isOver, semester },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-[200px] h-[200px] border-2 rounded-md bg-transparent ${
        isOver ? 'border-black' : 'border-slate-300'
      }`}
    >
      <SortableContext items={semester.courses} strategy={verticalListSortingStrategy}>
        <div className="w-full h-full">
          <h3>{semester.name}</h3>
          <ul>
            {semester.courses.map((course) => (
              <SemesterCourseItem
                key={course}
                id={semester.name + course}
                courseName={course}
                semesterId={semester.id}
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </div>
  );
});

interface SemesterCourseItemProps {
  id: UniqueIdentifier;
  semesterId: UniqueIdentifier;
  courseName: string;
}

const SemesterCourseItem: FC<SemesterCourseItemProps> = ({ id, semesterId, courseName }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: { fromSemester: true, semesterId, courseName },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

interface DraggableCourseItemProps extends React.ComponentPropsWithoutRef<'div'> {
  dragId: UniqueIdentifier;
  courseName: string;
}

const DraggableCourseItem: FC<DraggableCourseItemProps> = ({
  dragId: id,
  courseName,
  ...props
}) => {
  const { attributes, listeners, setNodeRef, over, isDragging } = useDraggable({
    id,
    data: { fromCourseList: true, courseName },
  });

  const isOver = useMemo(() => Boolean(isDragging && over), [over, isDragging]);

  return (
    <CourseItem
      ref={setNodeRef}
      isOver={isOver}
      courseName={courseName}
      {...attributes}
      {...listeners}
      {...props}
      style={{ ...props.style, opacity: isDragging ? '0.5' : undefined }}
    />
  );
};

interface CourseItemProps extends React.ComponentPropsWithoutRef<'div'> {
  isOver?: boolean;
  courseName: string;
  isOverlay?: boolean;
}

const CourseItem = React.forwardRef<HTMLDivElement, CourseItemProps>(function CourseItem(
  { courseName, ...props },
  ref,
) {
  return (
    <div ref={ref} className={`bg-white rounded-md border-2 flex items-center px-4`} {...props}>
      {courseName}
    </div>
  );
});

const TestPage1: NextPage = () => {
  const courseList = ['CS 1337', 'CS 1220', 'ECS 1100'];

  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 'f-2022', name: "Fall'22", courses: [] },
    { id: 's-2022', name: "Spring'22", courses: [] },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier>(null);
  console.log(semesters[0]);
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-100">
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={({ active, over }) => {
          setActiveId(null);
          if (active && over) {
            // from one semester -> another semester
            // NOTE: if both are courses (if you drop between semesters) kjthis still activates
            if (active.data.current?.fromSemester && active.data.current?.semesterId !== over.id) {
              const fromSemesterId = active.data.current.semesterId;
              const toSemesterId = over.id;
              const courseName = active.data.current.courseName;

              const isDuplicate = Boolean(
                semesters
                  .find((semester) => semester.id === toSemesterId)
                  ?.courses.find((course) => course === courseName),
              );
              if (isDuplicate) return;

              setSemesters(
                semesters.map((semester) => {
                  if (semester.id === fromSemesterId) {
                    return {
                      ...semester,
                      courses: semester.courses.filter((course) => course != courseName),
                    };
                  }

                  if (semester.id === toSemesterId) {
                    return { ...semester, courses: [...semester.courses, courseName] };
                  }

                  return semester;
                }),
              );
            }
            // course list -> semester droppable
            if (active.data.current?.fromCourseList) {
              const newCourse = active.data.current.courseName;

              const isDuplicate = Boolean(
                semesters
                  .find((semester) => semester.id === over.id)
                  ?.courses.find((c) => c === newCourse),
              );
              if (isDuplicate) return;

              setSemesters(
                semesters.map((semester) =>
                  semester.id === over.id
                    ? {
                        ...semester,
                        courses: [...semester.courses, newCourse],
                      }
                    : semester,
                ),
              );
            }
          }
        }}
      >
        <div className="grid grid-cols-[auto_1fr]">
          <section className="flex flex-col gap-[4px]">
            {courseList.map((course) => (
              <DraggableCourseItem
                key={course}
                dragId={course}
                style={{
                  width: '300px',
                  height: '50px',
                }}
                courseName={course}
              />
            ))}

            <DragOverlay dropAnimation={null}>
              {activeId && (
                <CourseItem
                  style={{
                    width: '300px',
                    height: '50px',
                  }}
                  courseName={`${activeId}`}
                  isOverlay
                />
              )}
            </DragOverlay>
          </section>

          <div className="flex flex-wrap gap-[20px]">
            {semesters.map((semester) => (
              <DroppableSemesterItem key={semester.id} id={semester.id} semester={semester} />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default TestPage1;
