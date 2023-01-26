import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';

import { PlanDegreeRequirement } from '../types';
import StatusTag from './StatusTag';

function RequirementsList({
  data,
  updateRequirementInfo,
}: {
  data: PlanDegreeRequirement[];
  updateRequirementInfo: (idx: number) => void;
}) {
  return (
    <>
      {data.map((elm, idx) => (
        <div className="flex justify-between px-2 py-1" key={idx}>
          <div className="text-sm">{elm.name}</div>
          <div className="text-[11px] flex flex-row items-center px-[5px]">
            <StatusTag status={elm.isfilled} />
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
export default React.memo(RequirementsList);
