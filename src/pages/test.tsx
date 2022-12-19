import CourseSelectorContainer from '@/components/planner/NewCourseSelector/CourseSelectorContainer';
import { DndContext } from '@dnd-kit/core';

// Data would be plan data I think?
export default function Test({ data }) {
  return (
    <DndContext>
      <div className="flex justify-center h-screen w-screen bg-[#F5F5F5]">
        <CourseSelectorContainer data={data} />
      </div>
    </DndContext>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  const validationData = (await import('@/data/dummyValidation.json'))['default'];

  console.log(validationData);
  // Pass data to the page via props
  return { props: { data: validationData } };
}
