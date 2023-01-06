export default function CourseStatusTag({ status }: { status: boolean }) {
  const tagText = status ? 'Complete' : 'Incomplete';
  const incomplete = !status ? 'border-red-500 text-red-500' : 'border-[#1C2A6D]';

  return (
    <div
      className={`${incomplete} flex justify-center items-center text-[11px] w-20 border rounded-md`}
    >
      {tagText}
    </div>
  );
}
