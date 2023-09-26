import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function AccordionSkeleton() {
  return (
    <>
      <div className={`flex justify-center rounded-2xl border p-6`}>
        <Skeleton width={200} className={`flex-1 grow`} />
      </div>
      <div className={`flex justify-center rounded-2xl border p-6`}>
        <Skeleton width={200} className={`flex-1 grow`} />
      </div>
    </>
  );
}
