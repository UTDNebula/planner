export default function SearchResults({ results }) {
  // TODO: Add sorting logic here
  return (
    <div className="bg-white flex flex-col gap-y-4 p-4 text-[#757575] ">
      {results.map((elm, idx) => (
        <div
          className="bg-white text-[10px] items-center drop-shadow-sm py-1.5 px-2 flex flex-row justify-between border border-[#EDEFF7] rounded-md"
          key={idx}
        >
          {elm.catalogCode}
          <div className="flex justify-center items-center text-[11px] w-20 border border-[#757575] rounded-md">
            Complete{' '}
          </div>
        </div>
      ))}
    </div>
  );
}
