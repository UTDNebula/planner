import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function RequirementsList({ data, updateCarousel }) {
  return (
    <>
      {data.map((elm, idx) => (
        <div className="flex justify-between px-2 py-1" key={idx}>
          <div className="text-sm">{elm.name}</div>
          <div className="text-[11px] flex flex-row items-center px-[5px]">
            <div className="flex justify-center items-center border rounded-md px-[10px] py-[1px] border-[#1C2A6D]">
              {elm.isfilled ? 'Complete' : 'Incomplete'}
            </div>
            <button
              onClick={() => {
                updateCarousel(idx);
              }}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
