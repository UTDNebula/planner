import React from 'react';
import List from '@material-ui/core/List';
import { PlanRequirement } from '../../lib/types';
import CourseCard from '../../courses/CourseCard';

interface PlanRequirementBlockProps {
  /**
   * Required courses for a degree plan.
   */
  requirement: PlanRequirement;

  enabled: boolean;
}

interface PlanRequirementBlockState {
  /**
   * False if more information should be shown for this course.
   */
  collapsed: boolean;
}

/**
 * A collection of courses under a specific designation.
 */
export default class PlanRequirementBlock extends React.Component<
  PlanRequirementBlockProps,
  PlanRequirementBlockState
> {
  public render() {
    const courses = this.props.requirement.courses.map((course, index) => {
      return (
        <CourseCard key={course.id} index={index} course={course} enabled={this.props.enabled} />
      );
      // TODO: Handle index offset due to position in plan requirement list
    });
    return (
      <div>
        <h2>{this.props.requirement.name}</h2>
        <List>{courses}</List>
      </div>
    );
  }
}
