import React, { useRef, useState } from 'react';
import { DegreeRequirementGroup } from './CourseSelectorContainer';

import RequirementContainer from './RequirementContainer';
import RequirementsAccordion from './RequirementsAccordion';

export default function RequirementsContainer({ data }: { data: DegreeRequirementGroup }) {
  const [carousel, setCarousel] = React.useState<boolean>(false);
  const [accordian, setAccordian] = React.useState<boolean>(false);
  const [requirementIdx, setRequirementIdx] = React.useState<number>(0);
  const [height, setHeight] = useState<string>('0px');

  const MIN_HEIGHT = 390;
  const accordianRef = useRef<HTMLDivElement>(null);
  const requirementRef = useRef<HTMLDivElement>(null);

  function toggleAccordion() {
    setAccordian(!accordian);
    setHeight(accordian ? '0px' : `${Math.max(accordianRef.current.scrollHeight, MIN_HEIGHT)}px`);
  }

  function toggleCarousel() {
    setCarousel(!carousel);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden border-black border-2">
        <div
          ref={requirementRef}
          className={` px-4 py-4 rounded-md relative z-30 duration-500 ${
            carousel && '-translate-x-full'
          } bg-white`}
        >
          <RequirementsAccordion
            data={data}
            toggleAccordion={toggleAccordion}
            accordion={accordian}
            setCarousel={toggleCarousel}
            setRequirementIdx={setRequirementIdx}
            height={height}
            accordianRef={accordianRef}
          />
        </div>
        <div
          className={` absolute top-0 p-4 animate-hide bg-white   ${
            accordian && carousel ? '' : 'duration-500  ease-in-out hidden'
          }  `}
          style={{
            height: requirementRef.current ? requirementRef.current.scrollHeight : MIN_HEIGHT,
          }}
        >
          <RequirementContainer
            data={data.requirements[requirementIdx]}
            setCarousel={toggleCarousel}
          />
        </div>
      </div>
    </div>
  );
}
