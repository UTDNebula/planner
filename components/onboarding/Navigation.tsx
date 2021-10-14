import React from 'react';
import Link from 'next/link';

export interface NavigationProps {
  navigationProps: NavigationStateProps;
}
export type NavigationStateProps = {
  personal: boolean;
  honors: boolean;
  credits: boolean;
};

export default function Navigation({ navigationProps }: NavigationProps): JSX.Element {
  return (
    <div className="h-30 flex justify-center m-0 text-white">
      <div
        className={`flex flex-col items-center border-4 border-navigation-dark ${
          navigationProps.personal ? 'bg-navigation-dark' : 'bg-navigation'
        } rounded-full w-20 h-20`}
      >
        <div className="text-sm p-top mt-2"> Step 1 </div>
        <div className="text-xs m-0 p-0"> Personal </div>
        <div className="text-xs -my-1 p-0"> Information </div>
      </div>
      <svg width="150">
        <line x1="0" y1="40" x2="150" y2="40" stroke="#C8D1F3" strokeWidth="6" />
      </svg>
      <div
        className={`flex flex-col items-center border-4 border-navigation-dark ${
          navigationProps.honors ? 'bg-navigation-dark' : 'bg-navigation'
        } rounded-full w-20 h-20`}
      >
        <div className="text-sm p-top mt-2"> Step 2 </div>
        <div className="text-xs m-0 p-0"> Scholarships </div>
        <div className="text-xs -my-1 p-0"> & Honors </div>
      </div>
      <svg width="150">
        <line x1="0" y1="40" x2="150" y2="40" stroke="#C8D1F3" strokeWidth="6" />
      </svg>
      <div
        className={`flex flex-col items-center border-4 border-navigation-dark ${
          navigationProps.credits ? 'bg-navigation-dark' : 'bg-navigation'
        } rounded-full w-20 h-20`}
      >
        <div className="text-sm p-top mt-2"> Step 3 </div>
        <div className="text-xs m-0 p-0"> Transferred </div>
        <div className="text-xs -my-1 p-0"> Credits </div>
      </div>
    </div>
  );
}
