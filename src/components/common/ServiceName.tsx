import React from 'react';

/**
 * Component properties for a ServiceName.
 */
interface ServiceNameProps {
  /**
   * A classname to be applied to the title text.
   */
  titleClassName?: string;
}

/**
 * A re-usable component to abstract styling for the logomark.
 */
export default function ServiceName({ titleClassName = '' }: ServiceNameProps): JSX.Element {
  // TODO: Finalize styles
  return (
    <div className="inline">
      <span className={titleClassName}>Comet Planning</span>
      <sup className="p-1 uppercase">Beta</sup>
    </div>
  );
}
