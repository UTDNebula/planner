import { Typography } from '@material-ui/core';
import React from 'react';
import CourseCard from './CourseCard';

/**
 * Component properties for an {@link SemesterBlock}.
 */
interface SemesterBlockProps {
  semesterCode: string;
  semesterTitle: string;
  courses: Array<{
    code: string;
    title: string;
    description: string;
  }>;
}

/**
 * A list of {@link CourseCard}s.
 */
export default function SemesterBlock(props: SemesterBlockProps) {
  const {semesterCode, semesterTitle, courses} = props;
  const courseItems = courses.map(({code, title, description}) => {
    return <CourseCard code={code} title={title} description={description} />;
  });
  return (
    <div>
      <header>
        <Typography variant="h6">
          {semesterTitle}
        </Typography>
      </header>
      <div>
        {courseItems}
      </div>
    </div>
  );
}