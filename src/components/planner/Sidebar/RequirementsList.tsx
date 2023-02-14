import { RequirementGroupTypes } from '@/pages/test';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';

import { DegreeRequirement } from '../types';
import StatusTag from './StatusTag';

function RequirementsList({
  data,
  updateRequirementInfo,
}: {
  data: RequirementGroupTypes[];
  updateRequirementInfo: (idx: number) => void;
}) {
  return (
    <>
      {data.map((elm, idx) => (
        <div className="flex justify-between px-2 py-1" key={idx}>
          <div className="text-sm">{elm.metadata ? elm.metadata.name : 'hi'}</div>
          <div className="flex flex-row items-center px-[5px] text-[11px]">
            <StatusTag status={elm.filled} />
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
