import { FC, useState, useRef } from 'react';

import ChevronIcon from '@/icons/ChevronIcon';

interface TransferBankProps {
  transferCredits: string[];
}

const TransferBank: FC<TransferBankProps> = ({ transferCredits }) => {
  const [open, setOpen] = useState(true);

  const bankRef = useRef(null);
  function toggleHeight() {
    if (open) {
      collapseSection(bankRef.current!);
    } 
    else {
      expandSection(bankRef.current!);
    }
  }

  function collapseSection(element: HTMLElement) {
    var sectionHeight = element.scrollHeight;
    setTimeout(() => {
      element.style.height = sectionHeight + 'px';
      requestAnimationFrame(function() {
        element.style.height = '50px';
      }); 
    }, 100);
  }

  function expandSection(element: HTMLElement) {
    let zero = performance.now();
    requestAnimationFrame(animate);
    function animate() {
      const value = (performance.now() - zero) / 1000;
      if (value < 1) {
        element.style.height = element.scrollHeight + 'px';
        requestAnimationFrame(animate);
      }
    }
  }

  return (
    <section ref={bankRef} className="w-full rounded-2xl border border-neutral-200 bg-generic-white px-5 py-3 shadow-sm flex-shrink-0 overflow-hidden transition-all duration-1000 ease-in-out">
      <article className="flex items-center justify-between">
        <h5 className="text-xl font-semibold text-primary-900">Transfer Credits</h5>
        <ChevronIcon
          className={`${
            open ? '-rotate-90' : 'rotate-90'
          } h-3 w-3 transform cursor-pointer text-neutral-500 transition-all duration-500`}
          fontSize="inherit"
          onClick={() => {
            toggleHeight();
            setOpen(!open);
          }}
        />
      </article>
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
