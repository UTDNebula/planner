import { Chip } from '@material-ui/core';
import React from 'react';

/**
 * Data used to populate a CourseSearchChip.
 */
export type CourseChipData = {
  /**
   * A unique identifier for this chip.
   */
  id: string;
  /**
   * The text displayed in the chip.
   */
  contents: string;

  /**
   * The hex color used for the chip's background.
   */
  color?: string;
};

/**
 * Component properties for a CourseSearchChip.
 */
export interface CourseSearchChipProps {
  /**
   * Data used to populate the CourseSearchChip.
   */
  chipData: CourseChipData;

  /**
   * Whether this chip should be highlighted.
   */
  selected: boolean;

  /**
   * A callback triggered when a chip reverts to an unselected state.
   */
  onUnselect: () => void;
}

/**
 * A chip used to filter search results.
 */
function CourseSearchChip({ selected, onUnselect }: CourseSearchChipProps): JSX.Element {
  const [isSelected, setIsSelected] = React.useState(false);
  const handleUnselect = () => {
    onUnselect();
  };

  const handleClick = () => {
    if (isSelected) {
      handleUnselect();
    }
    setIsSelected(!isSelected);
  };

  const variant = selected ? 'default' : 'outlined';

  return (
    <Chip
      variant={variant}
      onClick={handleClick}
      onDelete={isSelected ? handleUnselect : undefined}
    />
  );
}

export default CourseSearchChip;
