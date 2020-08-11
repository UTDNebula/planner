import React, { useState } from 'react';
import List from '@material-ui/core/List';
import { PlanRequirement } from '../../lib/types';
import CourseCard from '../../courses/CourseCard';
import { Typography } from '@material-ui/core';

interface PlanRequirementBlockProps {
  /**
   * Required courses for a degree plan.
   */
  requirement: PlanRequirement;

  enabled: boolean;
}

/**
 * A collection of courses under a specific designation.
 */
export default function PlanRequirementBlock(props: PlanRequirementBlockProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const { requirement, enabled } = props;
  const courses = requirement.courses.map((course, index) => {
    return <CourseCard key={course.id} index={index} course={course} enabled={enabled} />;
    // TODO: Handle index offset due to position in plan requirement list
  });
  return (
    <>{courses}</>
    // <div>
    //   {/* The following line prevents react-beautiful-dnd from working properly. */}
    //   {/* <Typography variant="h6">{props.requirement.name}</Typography> */}
    // </div>
  );
}
