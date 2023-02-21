import { useEffect } from 'react';
import { DegreeRequirement, GetDragIdByCourseAndReq } from '../types';

export default function RequirementsCarousel({
  requirementsList,
  requirementInfo,
  overflow,
  setOverflow,
  carousel,
}: {
  requirementsList: JSX.Element;
  requirementInfo: JSX.Element;
  overflow: boolean;
  setOverflow: (isOverflow: boolean) => void;
  carousel: boolean;
}) {
  useEffect(() => {
    setTimeout(() => setOverflow(false), 500);
  }, [overflow]);

  return (
    <>
      <div
        className={`${
          (overflow || !carousel) && 'overflow-hidden'
        } flex flex-row rounded-2xl border-2 border-[#D4D4D4] `}
      >
        <div
          className={`z-30 h-fit min-w-full rounded-md px-4 py-4 duration-500 ${
            carousel && '-translate-x-full'
          } `}
        >
          {requirementsList}
        </div>

        <div
          className={`relative flex min-h-fit min-w-full flex-col gap-4 rounded-md  p-4 duration-500 ${
            carousel ? '-translate-x-full' : 'max-h-0'
          }  `}
        >
          {requirementInfo}
        </div>
      </div>
    </>
  );
}
