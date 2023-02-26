import ChevronIcon from '@/icons/ChevronIcon';
import { FC, useState } from 'react';
import { Credit } from './types';

interface TransferBankProps {
  credits: Credit[];
}

const TransferBank: FC<TransferBankProps> = ({ credits }) => {
  const [open, setOpen] = useState(true);

  return (
    <section className="w-full rounded-2xl border border-neutral-200 bg-generic-white py-4 px-6 shadow-sm">
      <article className="flex items-center justify-between">
        <h5 className="text-2xl font-semibold">Transfer Credits</h5>
        <ChevronIcon
          className={`${
            open ? '-rotate-90' : 'rotate-90'
          } h-3 w-3 transform cursor-pointer text-neutral-500 transition-all duration-500`}
          fontSize="inherit"
          onClick={() => setOpen(!open)}
        />
      </article>
      <ol
        className={`mt-4 flex flex-wrap gap-x-10 gap-y-3 overflow-hidden transition-all duration-1000 ${
          open ? 'max-h-[999px]' : 'max-h-0'
        }`}
      >
        {credits.map((credit, i) => (
          <li
            key={credit.id + i}
            className="flex h-[40px] w-[250px] items-center rounded-md border border-neutral-200 px-5"
          >
            {credit.courseCode}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default TransferBank;
