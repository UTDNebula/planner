import React from 'react';
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
  // direction,
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

  // TODO: Detemrine best way to handle styling
  // const shouldScroll = true;
  // const classes = useStyles(shouldScroll, direction);

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
