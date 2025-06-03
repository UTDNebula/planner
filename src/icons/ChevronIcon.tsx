import React, { SVGProps } from 'react';

export default function ChevronIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 7 12"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" d="M1 1l5 5-5 5"></path>
    </svg>
  );
}
