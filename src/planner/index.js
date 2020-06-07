import React from 'react';
import { useParams } from 'react-router-dom';

export default function SchedulePlanner() {
  const { id, part } = useParams();
  const inSchedulingMode = part === 'plan';
  return (
    <main>
      <div>
        In scheduling mode: {inSchedulingMode ? 'Yes' : 'No'}
      </div>
      <div>
        Current schedule ID: {id}
        {/* TODO: Create four year schedule planner */}
      </div>
    </main>
  );
}