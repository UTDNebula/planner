import React from 'react';
import CourseSearchChip, { CourseChipData } from './CourseSearchChip';

/**
 * Component properties for a CourseSearchChipList.
 */
interface CourseSearchChipListProps {
  /**
   * The items displayed in the list.
   */
  chips: CourseChipData[];
}
/**
 * A list of CourseSearchChips.
 *
 * Displayed horizontally.
 */
export default function CourseSearchChipList({ chips }: CourseSearchChipListProps): JSX.Element {
  // TODO: Keep track of selection states.
  const chipItems = chips.map((chip) => {
    return (
      <CourseSearchChip
        key={chip.id}
        chipData={chip}
        selected={false}
        onUnselect={() => undefined}
      />
    );
  });
  return <div>{chipItems}</div>;
}
