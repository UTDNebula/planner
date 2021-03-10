import React from 'react';
import {
  // Card,
  // CardContent,
  createStyles,
  makeStyles,
  Theme,
  colors,
  Tooltip,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useToggleableCard } from './toggleableCard';
import styles from './CourseCard.module.css';

/**
 * Component properties for a {@link CourseCard}.
 */
export interface CourseCardProps {
  /**
   * The subject and number for this course.
   *
   * {@example CS 3345}
   */
  code: string;

  /**
   * The formal title for this course.
   */
  title: string;

  /**
   * The long description for this course.
   */
  description: string;

  /**
   * The number of credit hours this course is worth.
   */
  creditHours: number;

  /**
   * The estimated amount of hours spent per week outside class.
   */
  estimatedWorkload?: number;

  /**
   * True if an options menu should be shown for this course.
   */
  enabled: boolean;

  /**
   * A callback triggered when an a course should be removed from its container.
   */
  onOptionRemove?: (key: string) => void;

  /**
   * A callback triggered when a course should be swapped with another one
   */
  onOptionSwap?: (key: string) => void;
}

const useStyles = () => {
  return makeStyles((theme: Theme) => {
    return createStyles({
      root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: 2,
      },
      courseTitle: {
        fontSize: 12,
      },
      courseCode: {
        fontSize: 16,
      },
      popupIcon: {
        marginLeft: theme.spacing(0.5),
        fontSize: 16,
        color: colors.grey[700],
      },
    });
  })();
};

/**
 * Return a string version of the pluralized item based on a count.
 *
 * TODO: Find some more scalable way to do this task
 */
function pluralize(count?: number, item?: string, defaultCount = 0) {
  const trueCount = count ? count : defaultCount;
  const trueItemText = item ? (trueCount === 0 || trueCount > 1 ? item + 's' : item) : '';
  return `${trueCount} ${trueItemText}`;
}

/**
 * A card showing course details.
 */
function CourseCard(
  {
    code,
    title,
    description,
    creditHours,
    estimatedWorkload,
    enabled,
  }: // onOptionRemove = () => undefined,
  // onOptionSwap = () => undefined,
  // ...other
  CourseCardProps,
  ref: React.Ref<HTMLElement>,
) {
  const classes = useStyles();

  let tooltipReason;
  if (estimatedWorkload === undefined) {
    estimatedWorkload = 3 * creditHours;
    tooltipReason = `Estimated workload was determined by multiplying the number 
      of credit hours by 3.`;
  } else {
    tooltipReason = 'Estimated workload was determined based from user feedback.';
  }

  // TODO: Remove need for silly null/undefined checks
  const hoursText = pluralize(creditHours, 'credit hour', 3);
  const workloadText = pluralize(estimatedWorkload, 'hour');
  const creditHoursText = `${hoursText} | Est. ${workloadText}/week`;

  const {
    /* cardProps */
  } = useToggleableCard(enabled);

  // const cardStyles = {

  // };

  return (
    <article ref={ref} className={styles.CourseCard}>
      <div className="text-headline6 font-bold">{code}</div>
      <div className="text-subtitle1 font-bold">{title}</div>
      <div className="text-body2 break-words">{description}</div>
      <div className="mt-1">
        <span className="text-body2">{creditHoursText}</span>
        <span>
          <Tooltip title={tooltipReason} placement="right-end">
            <InfoIcon className={classes.popupIcon} />
          </Tooltip>
        </span>
      </div>
    </article>
  );
}

export default React.forwardRef(CourseCard);
