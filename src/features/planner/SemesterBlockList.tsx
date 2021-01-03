import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import SemesterBlock from './SemesterBlock';
import { Semester } from '../../app/data';

const useStyles = (shouldScroll: boolean, direction: 'vertically' | 'horizontally') => {
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
    })
  })();
};

/**
 * Component properties for a SemesterBlockList.
 */
interface SemesterBlockListProps {
  semesters: Semester[];
  enabled: boolean;
}

/**
 * A list of SemesterBlocks.
 * 
 * This list can be rendered vertically or horizontally by using component
 * props.
 */
export default function SemesterBlockList(props: SemesterBlockListProps) {
  const { semesters, enabled } = props;

  const shouldScroll = false;
  const scrollDirection = 'horizontally';
  const classes = useStyles(shouldScroll, scrollDirection);

  const semesterBlocks = semesters.map((semester) => {
    return (
      <div className={classes.semesterList}>
        <SemesterBlock
          showDragHandle={enabled}
          semesterCode={semester.code}
          semesterTitle={semester.title}
          courses={semester.courses}
          onAddCourse={() => { }}
          onShowSemesterInfo={() => { }}
          onClearSemester={() => { }}
          onRemoveSemester={() => { }}
        />
      </div>
    );
  });

  return (
    <div className={classes.semesterList}>
      {semesterBlocks}
    </div>
  );
}