import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ChevronIcon from '@/icons/ChevronIcon';
export default function AccordionSkeleton({}: {}) {
  return (
    <>
        <div className={`flex border rounded-2xl p-6 justify-center`}>
            <Skeleton width={200} className={`flex-1 grow`} />
        </div>
        <div className={`flex border rounded-2xl p-6 justify-center`}>
            <Skeleton width={200} className={`flex-1 grow`} />
        </div>

    </>
  );
}