import { FC } from 'react';

const BetaBanner: FC = () => {
  return (
    <div className="w-screen h-[50px] flex items-center justify-center gap-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex gap-3 items-center">
        <h3 className="text-white text-[18px] font-medium">{'Hey! This is our beta release'}</h3>
        <button className="bg-white hover:bg-gray-50 rounded-md px-2 py-1 flex items-center justify-center font-medium">
          Report a bug
        </button>
      </div>
      <div className="flex gap-3 items-center">
        <h3 className="text-white text-[18px] font-medium">{'Interested in contributing?'}</h3>
        <button className="bg-white hover:bg-gray-50 rounded-md px-2 py-1 flex items-center justify-center font-medium">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default BetaBanner;
