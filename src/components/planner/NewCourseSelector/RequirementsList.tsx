import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DegreeRequirement } from './CourseSelectorContainer';
import StatusTag from './StatusTag';

export default function RequirementsList({
  data,
  updateRequirementInfo,
}: {
  data: DegreeRequirement[];
  updateRequirementInfo: (idx: number) => void;
}) {
  return (
    <>
      {data.map((elm, idx) => (
        <div className="flex justify-between px-2 py-1" key={idx}>
          <div className="text-sm">{elm.name}</div>
          <div className="text-[11px] flex flex-row items-center px-[5px]">
            <StatusTag status={elm.isFilled} />
            <button
              onClick={() => {
                updateRequirementInfo(idx);
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
