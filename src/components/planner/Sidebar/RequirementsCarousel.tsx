import React from 'react';

export default function RequirementsCarousel({
  requirementsList,
  requirementInfo,
  carousel,
}: {
  requirementsList: React.ReactNode;
  requirementInfo: React.ReactNode;
  carousel: boolean;
}) {
  return (
    <>
      <div className={`flex flex-row overflow-hidden rounded-2xl border border-neutral-300`}>
        <div
          className={`z-30 h-full min-w-full rounded-md px-4 py-4 duration-500 ${
            carousel && '-translate-x-full'
          } `}
        >
          {requirementsList}
        </div>

        <div
          className={`relative flex min-w-full flex-col gap-4 rounded-md  p-4 duration-500 ${
            carousel ? '-translate-x-full' : 'max-h-0'
          }  `}
        >
          {requirementInfo}
        </div>
      </div>
    </>
  );
}
