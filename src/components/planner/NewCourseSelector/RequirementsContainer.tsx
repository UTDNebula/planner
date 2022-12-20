import React, { MutableRefObject, useState } from 'react';
import { DegreeRequirementGroup } from './CourseSelectorContainer';

import RequirementContainer from './RequirementContainer';
import RequirementsAccordion from './RequirementsAccordion';

export default function RequirementsContainer({ data }: { data: DegreeRequirementGroup }) {
  const [carousel, setCarousel] = React.useState<boolean>(false);
  const [accordian, setAccordian] = React.useState<boolean>(false);
  const [requirementIdx, setRequirementIdx] = React.useState<number>(0);
  const [height, setHeight] = useState<string>('0px');

  function toggleAccordion(contentSpace: MutableRefObject<HTMLDivElement>) {
    setAccordian((prevState) => !prevState);
    setHeight(accordian ? '0px' : `${contentSpace.current.scrollHeight + 20}px`);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className={` px-4 py-3 rounded-md relative z-30 duration-500 ${
            carousel && '-translate-x-full'
          } bg-white`}
        >
          <RequirementsAccordion
            data={data}
            toggleAccordion={toggleAccordion}
            accordion={accordian}
            setCarousel={setCarousel}
            setRequirementIdx={setRequirementIdx}
            height={height}
          />
        </div>
        <div
          className={` absolute top-0 p-4 animate-hide bg-white h-full ${
            accordian && carousel ? ' flex flex-col gap-4' : 'hidden'
          }  `}
        >
          <RequirementContainer
            data={data.requirements[requirementIdx]}
            setCarousel={setCarousel}
          />
        </div>
      </div>
    </div>
  );
}
