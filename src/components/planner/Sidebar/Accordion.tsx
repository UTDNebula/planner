import React from 'react';
import ChevronIcon from '@/icons/ChevronIcon';
export default function Accordian({
  header,
  children,
  filled = false,
}: {
  header: JSX.Element;
  children: JSX.Element;
  filled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  function toggleAccordion() {
    setOpen(!open);
  }
  return (
    <div className={`rounded-2xl  ${filled ? 'opacity-50' : ''}`}>
      <button
        className="flex w-full flex-row items-center justify-between px-2 duration-500"
        onClick={toggleAccordion}
      >
        {header}
        <ChevronIcon
          className={`${
            open ? '-rotate-90' : 'rotate-90'
          } ml-2 h-3 w-3 transform cursor-pointer text-neutral-500 transition-all duration-500`}
          fontSize="inherit"
          onClick={() => setOpen(!open)}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-700 ${
          open ? 'max-h-[999px]' : 'max-h-0'
        }`}
      >
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}
