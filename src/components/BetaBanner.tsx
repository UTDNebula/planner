import React, { FC } from 'react';

const BetaBanner: FC = () => {
  return (
    <div className="flex h-[50px] w-full items-center justify-center gap-8 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex items-center gap-3">
        <h3 className="text-[18px] font-medium text-white">{'Hey! This is our beta release'}</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.open('https://forms.gle/wx4zxm3cemut31tNA', '_blank');
          }}
          className="flex items-center justify-center rounded-md bg-white px-2 py-1 font-medium hover:bg-gray-50 cursor-pointer"
        >
          Report a bug
        </button>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-[18px] font-medium text-white">{'Interested in contributing?'}</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.open(
              'https://sites.google.com/view/nebula-labs-planner/home?authuser=0',
              '_blank',
            );
          }}
          className="flex items-center justify-center rounded-md bg-white px-2 py-1 font-medium hover:bg-gray-50 cursor-pointer"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default BetaBanner;
