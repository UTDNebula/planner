import React from 'react';

/**
 * Component properties for a SectionsIndicator.
 */
interface SectionsIndicatorProps {
  /**
   * The index of the section currently in view.
   *
   * TODO: Like seriously, don't use JS for this.
   */
  activeSection: number;
  sections: string[];
}

export default function SectionsIndicator(props: SectionsIndicatorProps): JSX.Element {
  const {
    /* activeSection, */
    sections,
  } = props;

  const indicators = sections.map((title, index) => {
    // const color = index === activeSection ? '' : '';
    return (
      <div className="p-2" key={title + index}>
        {title}
      </div>
    );
  });
  return <div>{indicators}</div>;
}
