import React, { useEffect, useRef, useState } from 'react';

import { DegreeRequirementGroup, GetDragIdByCourseAndReq } from '../types';
import RequirementContainer from './RequirementContainer';
import RequirementsAccordion from './RequirementsAccordion';

export interface RequirementsCarouselProps {
  degreeRequirement: DegreeRequirementGroup;
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

export default function RequirementsCarousel({
  degreeRequirement,
  getCourseItemDragId,
}: RequirementsCarouselProps) {
  const [carousel, setCarousel] = React.useState<boolean>(false);
  const [accordian, setAccordian] = React.useState<boolean>(false);
  const [requirementIdx, setRequirementIdx] = React.useState<number>(0);
  const [height, setHeight] = useState<string>('0px');

  const accordianRef = useRef<HTMLDivElement>(null);

  function toggleAccordion() {
    setAccordian(!accordian);
    setHeight(
      accordian
        ? '0px'
        : `${Math.max(accordianRef.current ? accordianRef.current.scrollHeight + 20 : 0)}px`,
    );
  }

  function toggleCarousel() {
    setOverflow(true);
    setCarousel(!carousel);
  }

  // Note: this logic hides overflow during sliding animation
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    setTimeout(() => setOverflow(false), 500);
  }, [overflow]);

  return (
    <div className="relative">
      <div
        className={`${
          (overflow || !carousel) && 'overflow-hidden'
        } rounded-md flex flex-row bg-white`}
      >
        <div
          className={`min-w-full h-fit px-4 py-4 rounded-md z-30 duration-500 ${
            carousel && '-translate-x-full'
          } `}
        >
          {(!carousel || overflow) && (
            <RequirementsAccordion
              data={degreeRequirement}
              toggleAccordion={toggleAccordion}
              accordion={accordian}
              carousel={carousel}
              setCarousel={toggleCarousel}
              setRequirementIdx={setRequirementIdx}
              height={height}
              accordianRef={accordianRef}
            />
          )}
        </div>

        <div
          className={`flex flex-col gap-4 relative min-w-full p-4 bg-white rounded-md min-h-fit duration-500 ${
            accordian && carousel ? '-translate-x-full' : 'max-h-0'
          }  `}
        >
          <RequirementContainer
            degreeRequirement={degreeRequirement.requirements[requirementIdx]}
            setCarousel={toggleCarousel}
            getCourseItemDragId={getCourseItemDragId}
          />
        </div>
      </div>
    </div>
  );
}
