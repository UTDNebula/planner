import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import SemesterBlock, { SemesterCallback } from './SemesterBlock';
import { Semester } from '../../app/data';

/**
 * A direction a list should scroll.
 */
export enum ScrollDirection {
  /**
   * Scroll in the Y direction.
   */
  'vertically',

  /**
   * Scroll in the X direction
   */
  'horizontally',
}

/**
 * Creates styles used for a SemesterBlockList.
 *
 * @param shouldScroll True if the list should enable overflow scrolling
 * @param direction One of 'vertically' or 'horizontally' indicating layout direction
 */
const useStyles = (shouldScroll: boolean, direction: ScrollDirection) => {
  return makeStyles((theme: Theme) => {
    const isNormal = direction === 'horizontally';
    const overflow = isNormal ? 'overflowX' : 'overflowY';
    return createStyles({
      root: {
        [overflow]: shouldScroll ? 'scroll' : 'hidden',
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      block: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
      },
      semesterDisplay: {
        display: 'flex',
        marginTop: theme.spacing(2),
        flexWrap: 'wrap',
      },
      semesterList: {
        marginLeft: 64,
        display: 'flex',
        flexWrap: 'wrap',
      },
      semesterItem: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    });
  })();
};

/**
 * Component properties for a SemesterBlockList.
 */
interface SemesterBlockListProps {

  /**
   * The semester items to display.
   */
  semesters: Semester[];

  /**
   * Whether or not drag-and-drop functionality is enabled.
   */
  enabled: boolean;

  /**
   * Called when a course addition request is triggered.
   */
  onAddCourse: SemesterCallback;

  /**
   * Called when more information about this semester should be displayed.
   */
  onShowSemesterInfo: SemesterCallback;

  /**
   * Called when this semester should be cleared of its courses.
   */
  onClearSemester: SemesterCallback;

  /**
   * Called when this semester should be deleted from its parent.
   */
  onRemoveSemester: SemesterCallback;

  /**
   * The direction SemesterBlocks should be laid out.
   */
  direction: ScrollDirection;
}

/**
 * A list of SemesterBlocks.
 * 
 * This list can be rendered vertically or horizontally by using component
 * props.
 */
export default function SemesterBlockList({
  semesters,
  enabled,
  onAddCourse,
  onShowSemesterInfo,
  onClearSemester,
  onRemoveSemester,
  direction,
  children,
}: React.PropsWithChildren<SemesterBlockListProps>) {

  const shouldScroll = false;
  const classes = useStyles(shouldScroll, direction);

  const semesterBlocks = semesters.map((semester) => {
    return (
      <SemesterBlock
        key={semester.code}
        showDragHandle={enabled}
        semesterCode={semester.code}
        semesterTitle={semester.title}
        courses={semester.courses}
        onAddCourse={onAddCourse}
        onShowSemesterInfo={onShowSemesterInfo}
        onClearSemester={onClearSemester}
        onRemoveSemester={onRemoveSemester}
        displayOnly={false}
      />
    );
  });

  return (
    <div className={classes.root}>
      {semesterBlocks}
      {children}
    </div>
  );
}
