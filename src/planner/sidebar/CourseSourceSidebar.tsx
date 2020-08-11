import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { PlanRequirement } from '../../lib/types';
import { RootState } from '../../store/reducers';
import { Course } from '../../store/catalog/types';
import { AppDispatch } from '../../store';
import PlanRequirementBlock from './PlanRequirementBlock';
import CourseCard from '../../courses/CourseCard';
import CourseSearch from './CourseSearch';
import './CourseSourceSidebar.css';

export const SIDEBAR_DROPPABLE_ID = 'courseSource';

/**
 * Component properties for the CourseSourceSidebar.
 */
interface CourseSourceSidebarProps {
  /**
   * Course requirements displayed in this sidebar.
   */
  requirements: PlanRequirement[];

  /**
   * True if items in this sidebar can be modified.
   */
  enabled: boolean;
}

const useSidebarDispatch = () => useDispatch<AppDispatch>();

function CourseSourceSidebar(props: CourseSourceSidebarProps): JSX.Element {
  const allCourses = useSelector((state: RootState) => state.courses);
  const dispatch = useSidebarDispatch();
  const [requirements, setRequirements] = useState<PlanRequirement[]>([]);
  // const requirementBlocks = props.requirements.map((requirement, index) => {
  //   return (
  //     <PlanRequirementBlock
  //       key={requirement.name}
  //       enabled={props.enabled}
  //       requirement={requirement}
  //     />
  //   );
  // });
  let courses: Course[] = [];
  for (const requirement of props.requirements) {
    courses = courses.concat(requirement.courses);
  }
  const courseList = courses.map((course: Course, index: number) => {
    return (
      <CourseCard
        key={course.subject + ' ' + course.suffix}
        index={index}
        course={course}
        enabled={props.enabled}
      />
    );
  });
  return (
    <section className="course-source-sidebar">
      <CourseSearch courses={allCourses} />
      <Typography variant="h5">Degree Plan Requirements</Typography>
      <div className="plan-requirement-list">
        <Droppable droppableId={SIDEBAR_DROPPABLE_ID}>
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {/* {requirementBlocks} */}
              {courseList}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </section>
  );
}

export default CourseSourceSidebar;
