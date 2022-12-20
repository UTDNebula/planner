import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import RequirementsList from './RequirementsList';
import { MutableRefObject, useRef } from 'react';
import { DegreeRequirementGroup } from './CourseSelectorContainer';

export default function RequirementsAccordion({
  data,
  toggleAccordion,
  accordion,
  setCarousel,
  setRequirementIdx,
  height,
}: {
  data: DegreeRequirementGroup;
  toggleAccordion: (ref: MutableRefObject<HTMLDivElement>) => void;
  accordion: boolean;
  setCarousel: (state: boolean) => void;
  setRequirementIdx: (req: number) => void;
  height: string;
}) {
  const contentSpace = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full">
      <button
        className="flex flex-row w-full justify-between px-2"
        onClick={() => toggleAccordion(contentSpace)}
      >
        <div className="">{data.name}</div>
        {accordion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </button>

      <div
        ref={contentSpace}
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
