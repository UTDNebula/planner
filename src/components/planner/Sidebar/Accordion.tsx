import React from 'react';
import ChevronIcon from '@/icons/ChevronIcon';
export default function Accordion({
  header,
  children,
  filled = false,
  startOpen = false,
}: {
  header: JSX.Element;
  children: JSX.Element;
  filled?: boolean;
  startOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(startOpen);
  function toggleAccordion() {
    setOpen(!open);
  }
  return (
    <div className={` rounded-md ${filled ? ' opacity-50' : ''}`}>
      <button
        className="flex w-full flex-row items-center justify-between px-2 duration-500"
        onClick={toggleAccordion}
      >
        {header}
        <div className="flex flex-row">
          <ChevronIcon
            className={`${
              open ? '-rotate-90' : 'rotate-90'
            } ml-2 h-3 w-3 transform cursor-pointer text-neutral-500 transition-all duration-500`}
            fontSize="inherit"
            onClick={() => setOpen(!open)}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-700 ${
          open ? 'max-h-[999px]' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-y-4 pt-2">{children}</div>
      </div>
    </div>
  );
}
