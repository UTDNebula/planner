import React from 'react';
import { useCreateNewPlanFlow } from './hooks/newPlanFlow';

/**
 * A dialog that allows a user to initialize a new CoursePlan.
 */
export default function NewPlanDialog(): JSX.Element {
  const { planState, goForward, goBack, reset } = useCreateNewPlanFlow();

  let contents;
  if (planState === 'SELECT_MAJOR') {
    contents = (
      <div>
        {/* TODO: Add A list showing all majors and ability to select */}
        {/* TODO: Show description for each */}
      </div>
    );
  } else {
    // TODO: Implement other parts of new plan flow
    contents = <div></div>;
  }

  /**
   * Reset dialog state and dismiss this dialog.
   */
  const finish = () => {
    reset();
  };

  // Select major
  // Add transfer courses
  return (
    <div>
      <header>{/* Title */}</header>
      <div className="p-2">{contents}</div>
      <nav>{/* Step counter */}</nav>
      <button onClick={goForward}>Next</button>
      <button onClick={goBack}>Previous</button>
      <button onClick={finish}>Done</button>
    </div>
  );
}
