import React, { FC, useRef } from 'react';

import ChevronIcon from '@/icons/ChevronIcon';
import useAccordionAnimation from '@/shared/useAccordionAnimation';

interface TransferBankProps {
  transferCredits: string[];
}

const TransferBank: FC<TransferBankProps> = ({ transferCredits }) => {
  const bankRef = useRef(null);
  const { toggle, open } = useAccordionAnimation(bankRef, () => '50px');

  return (
    <section
      ref={bankRef}
      className="w-full shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-generic-white px-5 py-3 shadow-xs transition-all duration-1000 ease-in-out"
    >
      <article className="flex items-center justify-between">
        <h5 className="text-xl font-semibold text-primary-900">Transfer Credits</h5>
        <ChevronIcon
          className={`${
            open ? '-rotate-90' : 'rotate-90'
          } h-3 w-3 transform cursor-pointer text-neutral-500 transition-all duration-500`}
          fontSize="inherit"
          onClick={toggle}
        />
      </article>
      <div className="mt-2 flex">
        <div className="flex items-center gap-x-3 rounded-full bg-primary-100 px-2 py-1">
          <span className="whitespace-nowrap text-[11px] font-medium text-primary-500 lg:text-sm">
            {/*Assumes the second digit in the second word in each course code is the number of credits it provides*/}
            {transferCredits.reduce((acc, curr) => acc + parseInt(curr.split(' ')[1][1]), 0)}{' '}
            Credits Taken
          </span>
        </div>
      </div>
      <ol
        className={`mt-4 flex flex-wrap gap-x-10 gap-y-3 transition-all duration-1000 ease-in-out`}
      >
        {transferCredits.map((credit, i) => (
          <li
            key={`transfer-${credit}-${i}`}
            className="flex h-[40px] flex-row flex-wrap items-center rounded-md border border-neutral-200 px-5"
          >
            {credit}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default TransferBank;
