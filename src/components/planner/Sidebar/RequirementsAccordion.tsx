import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { RefObject } from 'react';

import { PlanDegreeRequirementGroup } from '../types';
import RequirementsList from './RequirementsList';

function RequirementsAccordion({
  data,
  toggleAccordion,
  accordion,
  carousel,
  setCarousel,
  setRequirementIdx,
  height,
  accordianRef,
}: {
  data: PlanDegreeRequirementGroup;
  toggleAccordion: () => void;
  accordion: boolean;
  carousel: boolean;
  setCarousel: (state: boolean) => void;
  setRequirementIdx: (req: number) => void;
  height: string;
  accordianRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div className={`w-full ${!carousel ? 'h-full' : 'h-0'}`}>
      <button className="flex flex-row w-full justify-between px-2" onClick={toggleAccordion}>
        <div className="">{data.name}</div>
        {accordion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </button>

      <div
        ref={accordianRef}
        className={`overflow-auto duration-500 ease-in-out ${accordion && 'pt-4'}`}
        style={{ height }}
      >
        <RequirementsList
          data={data.requirements}
          updateRequirementInfo={(idx) => {
            setCarousel(true);
            setRequirementIdx(idx);
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(RequirementsAccordion);
