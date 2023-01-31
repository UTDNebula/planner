export default function CourseStatusTag({ status }: { status: boolean }) {
  const tagText = status ? 'Complete' : 'Incomplete';
  const incomplete = !status ? 'border-red-500 text-red-500' : 'border-[#1C2A6D]';

  return (
    <div
      className={`${incomplete} flex w-20 items-center justify-center rounded-md border text-[11px]`}
    >
      {tagText}
    </div>
  );
}
