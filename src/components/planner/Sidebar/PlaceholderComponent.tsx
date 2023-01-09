export default function PlaceholderComponent({
  placeholderName,
  placeholderHours,
  setPlaceholderName,
  setPlaceholderHours,
  handlePlaceholderCancel,
  handlePlaceholderSubmit,
}: {
  placeholderName: string;
  placeholderHours: number;
  setPlaceholderName: (name: string) => void;
  setPlaceholderHours: (hours: number) => void;
  handlePlaceholderCancel: () => void;
  handlePlaceholderSubmit: () => void;
}) {
  return (
    <>
      <div className="bg-white text-[10px] items-center drop-shadow-sm py-1.5 px-2 gap-x-4 flex flex-row justify-between border border-[#EDEFF7] rounded-md">
        <input
          value={placeholderName}
          placeholder="Add Placeholder Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaceholderName(e.target.value)}
        ></input>
        <input
          value={placeholderHours || undefined}
          className="flex w-20"
          placeholder="Add # hours"
          inputMode="numeric"
          onChange={(e) => setPlaceholderHours(parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-row justify-between text-[10px] text-[#3E61ED] gap-x-4">
        <button onClick={handlePlaceholderCancel}>CANCEL</button>
        <button onClick={handlePlaceholderSubmit}>SELECT</button>
      </div>
    </>
  );
}
