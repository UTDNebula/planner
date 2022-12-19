import DraggableCourse from './DraggableCourse';

export default function DraggableCourseContainer({ results }) {
  // Add sorting logic here
  return (
    <div className="bg-white flex flex-col gap-y-4 text-[#757575]">
      {results.map((elm, idx) => (
        <DraggableCourse key={idx} elm={elm} idx={idx} />
      ))}
    </div>
  );
}
