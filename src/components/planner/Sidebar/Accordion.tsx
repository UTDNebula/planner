import React, { FC, useRef, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
export default function Accordian({
  header,
  children,
}: {
  header: JSX.Element;
  children: JSX.Element;
}) {
  const [accordion, setAccordion] = React.useState(false);
  const [height, setHeight] = useState<string>('0px');
  const accordionRef = useRef<HTMLDivElement>(null);
  function toggleAccordion() {
    setAccordion(!accordion);
    setHeight(
      accordion
        ? '0px'
        : `${Math.max(accordionRef.current ? accordionRef.current.scrollHeight + 20 : 0)}px`,
    );
  }
  return (
    <div>
      <button
        className="flex w-full flex-row items-center justify-between px-2"
        onClick={toggleAccordion}
      >
        {header}
        {accordion ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </button>

      <div
        ref={accordionRef}
        className={`overflow-auto duration-500 ease-in-out ${accordion && 'pt-4'}`}
        style={{ height }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * TODO: Make this custom because it's causing annoying behaviors
 * TODO: Add progress here
 * @param param0
 * @returns
 */
export function AccordianWrapper({
  name,
  filled,
  children,
}: {
  name: string;
  filled?: boolean;
  children: any;
}) {
  return (
    <div className={`collapse-arrow collapse ${filled && 'opacity-50'}`} tabIndex={0}>
      <input type="checkbox" className="border-32 border-orange-500" />
      <div className="collapse-title flex flex-row items-center">
        {name} {filled && <CheckIcon fontSize="small" />}
      </div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
