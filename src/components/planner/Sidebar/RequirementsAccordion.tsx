import { DegreeRequirement } from '@/pages/test';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { RefObject } from 'react';

import { DegreeRequirementGroup } from '../types';
import RequirementsList, { ProgressComponent } from './RequirementsList';

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
  data: DegreeRequirement;
  toggleAccordion: () => void;
  accordion: boolean;
  carousel: boolean;
  setCarousel: (state: boolean) => void;
  setRequirementIdx: (req: number) => void;
  height: string;
  accordianRef: RefObject<HTMLDivElement>;
}) {
  const value = data.num_fulfilled_requirements;

  const max = data.num_requirements;

  return (
    <div className={`w-full ${!carousel ? 'h-full' : 'h-0'}`}>
      <button className="flex w-full flex-row justify-between px-2" onClick={toggleAccordion}>
        <div className="">{data.name}</div>
        <div className="flex-fow flex items-center">
          <ProgressComponent value={value} max={max} />
          {accordion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
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
