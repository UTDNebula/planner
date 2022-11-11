import { Theme, Typography } from '@mui/material';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { convertSemesterToData } from './data-utils';
import { HonorsIndicator } from './types';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    attemptedHours: {},
  };
});

/**
 * Component properties for a UserDetailsBlock.
 */
export interface UserDetailsBlockProps {
  /**
   * The student's full name.
   */
  name?: string;

  planTitle: string;

  /**
   * Example: Liberal
   */
  honorsIndicators: HonorsIndicator[];

  /**
   * The starting date.
   *
   * @example 2019f
   */
  start: string;

  /**
   * Example: "Class of 2023"
   */
  classText: string;
  estimatedGraduation: string;
  coursesCompleted: number;
  attemptedHours: number;
  coursesRemaining: number;
  gpa: number;
}

// NOTE: UNUSED COMPONENT
// TODO: Either use or remove for Planner v1
export default function UserDetailsBlock(props: UserDetailsBlockProps): JSX.Element {
  const {
    name,
    planTitle,
    honorsIndicators,
    start,
    classText,
    attemptedHours,
    coursesCompleted,
    coursesRemaining,
    gpa,
  } = props;

  const honorsIndicatorText =
    honorsIndicators.length > 0
      ? honorsIndicators
          .reduce((acc, indicator, index) => {
            let result = acc.concat(`${indicator}`);
            if (index < honorsIndicators.length - 1) {
              result = result.concat(', ');
            }
            return result;
          }, 'A ')
          .concat(' scholar')
      : '';

  const { year: startingYear, semester: startingSemester } = convertSemesterToData(start);

  console.log('Starting year: ' + startingYear + ', starting semester: ' + startingSemester);

  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="subtitle1">{classText}</Typography>
        <Typography variant="subtitle2">{planTitle}</Typography>
        <Typography variant="caption">{honorsIndicatorText}</Typography>
      </div>
      <div>
        <Typography variant="caption">GPA: {gpa.toFixed(3)}</Typography> | &nbsp;
        <Typography variant="caption">
          {coursesCompleted}/{coursesCompleted + coursesRemaining} courses fulfilled
        </Typography>{' '}
        | &nbsp;
        <Typography variant="caption" component="span" className={classes.attemptedHours}>
          {attemptedHours} attmpted hours
        </Typography>
      </div>
    </div>
  );
}
