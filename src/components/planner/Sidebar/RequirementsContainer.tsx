import { DegreeRequirement } from '@/pages/test';
import React, { useState } from 'react';

import { GetDragIdByCourseAndReq } from '../types';
import Accordion from './Accordion';
import RequirementContainer from './RequirementContainer';
import { displayRequirementProgress, ProgressComponent } from './RequirementsList';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RequirementsCarousel from './RequirementsCarousel';

export interface RequirementsContainerProps {
  degreeRequirement: DegreeRequirement;
  courses: string[];
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

export default function RequirementsContainer({
  degreeRequirement,
  courses,
  getCourseItemDragId,
}: RequirementsContainerProps) {
  const [requirementIdx, setRequirementIdx] = React.useState<number>(0);

  /**
   * These hooks manage the carousel state for RequirementsCarousel
   */
  const [carousel, setCarousel] = React.useState<boolean>(false);

  // Note: this logic hides overflow during sliding animation
  const [overflow, setOverflow] = useState(false);

  function toggleCarousel() {
    setOverflow(true);
    setCarousel(!carousel);
  }

  return (
    <RequirementsCarousel
      overflow={overflow}
      setOverflow={setOverflow}
      carousel={carousel}
      requirementsList={
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
      }
      requirementInfo={
        <RequirementContainer
          degreeRequirement={degreeRequirement.requirements[requirementIdx]}
          courses={courses}
          setCarousel={toggleCarousel}
          getCourseItemDragId={getCourseItemDragId}
        />
      }
    ></RequirementsCarousel>
  );
}
