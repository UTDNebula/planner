import { DegreeRequirement } from '@/pages/test';
import React, { useEffect, useRef, useState } from 'react';

import { DegreeRequirementGroup, GetDragIdByCourseAndReq } from '../types';
import Accordion from './Accordion';
import RequirementContainer from './RequirementContainer';
import { displayRequirementProgress, ProgressComponent } from './RequirementsList';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
export interface RequirementsCarouselProps {
  degreeRequirement: DegreeRequirement;
  courses: string[];
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

function RequirementsCarousel({
  degreeRequirement,
  courses,
  getCourseItemDragId,
}: RequirementsCarouselProps) {
  const [carousel, setCarousel] = React.useState<boolean>(false);
  const [requirementIdx, setRequirementIdx] = React.useState<number>(0);

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
    <>
      <div
        className={`${
          (overflow || !carousel) && 'overflow-hidden'
        } flex flex-row rounded-md bg-white`}
      >
        <div
          className={`z-30 h-fit min-w-full rounded-md px-4 py-4 duration-500 ${
            carousel && '-translate-x-full'
          } `}
        >
          <Accordion
            header={
              <div className="flex w-full flex-row items-center justify-between ">
                <div className="">{degreeRequirement.name}</div>

                <ProgressComponent
                  value={degreeRequirement.num_fulfilled_requirements}
                  max={degreeRequirement.num_requirements}
                />
              </div>
            }
          >
            <>
              {degreeRequirement.requirements.map((elm, idx) => {
                const { value, max } = displayRequirementProgress(elm);
                return (
                  <div className="flex justify-between px-2 py-1" key={idx}>
                    <div className="text-sm">{elm.metadata ? elm.metadata.name : 'hi'}</div>
                    <div className="flex flex-row items-center px-[5px] text-[11px]">
                      <ProgressComponent value={value} max={max} />

                      <button
                        onClick={() => {
                          toggleCarousel();
                          setRequirementIdx(idx);
                        }}
                      >
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          </Accordion>
        </div>

        <div
          className={`relative flex min-h-fit min-w-full flex-col gap-4 rounded-md bg-white p-4 duration-500 ${
            carousel ? '-translate-x-full' : 'max-h-0'
          }  `}
        >
          <RequirementContainer
            degreeRequirement={degreeRequirement.requirements[requirementIdx]}
            courses={courses}
            setCarousel={toggleCarousel}
            getCourseItemDragId={getCourseItemDragId}
          />
        </div>
      </div>
    </>
  );
}

export default RequirementsCarousel;

/**
 * Create a component to handle passing the requirement info; pass all re
 */
