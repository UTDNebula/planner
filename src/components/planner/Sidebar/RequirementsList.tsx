import { RequirementGroupTypes, RequirementTypes } from '@/pages/test';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';

function RequirementsList({
  data,
  updateRequirementInfo,
}: {
  data: RequirementGroupTypes[];
  updateRequirementInfo: (idx: number) => void;
}) {
  // TODO: Prolly should have a better way of handling this

  return (
    <>
      {data.map((elm, idx) => {
        const { value, max } = displayRequirementProgress(elm);
        return (
          <div className="flex justify-between px-2 py-1" key={idx}>
            <div className="text-sm">{elm.metadata ? elm.metadata.name : 'hi'}</div>
            <div className="flex flex-row items-center px-[5px] text-[11px]">
              <ProgressComponent value={value} max={max} />

              <button
                onClick={() => {
                  updateRequirementInfo(idx);
                }}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
export default React.memo(RequirementsList);

export const ProgressComponent = ({ value, max }: { value: number; max: number }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[10px]">
        {value}/{max} done
      </span>
      <progress id="file" value={value} max={max} className="h-2 w-10" />
    </div>
  );
};

export const displayRequirementProgress = (elm: RequirementGroupTypes) => {
  switch (elm.matcher) {
    case 'And':
      return { value: elm.num_fulfilled_requirements, max: elm.num_requirements };
    case 'CS Guided Electives':
      return { value: elm.fulfilled_count, max: elm.required_count };
    case 'FreeElectives':
      return { value: elm.fulfilled_hours, max: elm.required_hours };
    default:
      return { value: 0, max: 100 };
  }
};
