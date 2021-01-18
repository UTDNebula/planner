import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { SemesterCallback } from './SemesterBlock';
import { Semester } from '../../app/data';
import DroppableSemesterBlock from '../../components/common/DroppableSemesterBlock/DroppableSemesterBlock';

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
    const isNormal = direction === ScrollDirection.horizontally;
    const overflow = isNormal ? 'overflowX' : 'overflowY';
    return createStyles({
      // root: {
      //   [overflow]: shouldScroll ? 'scroll' : 'hidden',
      //   paddingLeft: theme.spacing(2),
      //   paddingRight: theme.spacing(2),
      // },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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
  onAddCourse?: SemesterCallback;

  /**
   * Called when more information about this semester should be displayed.
   */
  onShowSemesterInfo?: SemesterCallback;

  /**
   * Called when this semester should be cleared of its courses.
   */
  onClearSemester?: SemesterCallback;

  /**
   * Called when this semester should be deleted from its parent.
   */
  onRemoveSemester?: SemesterCallback;

  /**
   * The direction SemesterBlocks should be laid out.
   */
  direction: ScrollDirection;

  /**
   * The ID of the first currently displayed semester in this list.
   */
  focusedSemester: string;
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
  onAddCourse = () => undefined,
  onShowSemesterInfo = () => undefined,
  onClearSemester = () => undefined,
  onRemoveSemester = () => undefined,
  direction,
  focusedSemester,
  children,
}: React.PropsWithChildren<SemesterBlockListProps>): JSX.Element {
  const blockRefs = semesters
    .map((semester) => semester.code)
    .reduce((refs: { [key: string]: React.RefObject<HTMLDivElement> }, semesterCode) => {
      refs[semesterCode] = React.createRef();
      return refs;
    }, {});

  const scrollToSemester = (semesterCode: string) => {
    const semesterRef = blockRefs[semesterCode];
    if (semesterRef == null || semesterRef.current == null) {
      console.warn(`Semester ref or current for ${semesterCode} is null`);
      return;
    }
    semesterRef.current.scrollIntoView({
      behavior: 'smooth',
      // block: 'start',
    });
  };

  const shouldScroll = true;
  const classes = useStyles(shouldScroll, direction);

  const semesterBlocks = semesters.map((semester) => {
    const ref = blockRefs[semester.code];
    return (
      <DroppableSemesterBlock
        ref={ref}
        // id={semester.code}
        key={semester.code}
        semesterCode={semester.code}
        semesterTitle={semester.title}
        courses={semester.courses}
        onAddCourse={onAddCourse}
        onShowSemesterInfo={onShowSemesterInfo}
        onClearSemester={onClearSemester}
        onRemoveSemester={onRemoveSemester}
        enabled={enabled}
      />
    );
  });

  React.useEffect(() => {
    if (false) {
      scrollToSemester(focusedSemester);
    }
  }, [focusedSemester]);

  return (
    <div
      style={{
        overflowX: 'scroll',
        gridAutoFlow: 'column',
        display: 'grid',
        gridGap: '4px',
        gridAutoColumns: 'calc(50% - 24px)',
        padding: '16px',
      }}
    >
      {semesterBlocks}
      {children}
    </div>
  );
}
