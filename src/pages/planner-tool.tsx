import { NextPage } from 'next';
import { useState } from 'react';

import { Course, PlannerTool, Semester } from '@/components/planner2/Planner';

const Test3Page: NextPage = () => {
  const courses: Course[] = [
    { id: '1', name: 'ECS 1110' },
    { id: '2', name: 'CS 1337' },
  ];
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: "Fall'22", courses: [] },
    { id: '2', name: "Spring'23", courses: [] },
    { id: '3', name: "Summer'23", courses: [] },
  ]);

  return (
    <div className="w-screen h-screen bg-[#FFFBF7]">
      <PlannerTool
        courses={courses}
        semesters={semesters}
        setSemesters={(semesters) => setSemesters(semesters)}
      />
    </div>
  );
};

export default Test3Page;
