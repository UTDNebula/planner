import React, { SVGProps } from 'react';

export default function UnfilledWarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      fill="none"
      viewBox="0 0 16 17"
      {...props}
    >
      <path
        stroke="inherit"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M8 5.602v3.11m0 3.112h.008M15 8.713a7 7 0 11-14 0 7 7 0 0114 0z"
      ></path>
    </svg>
  );
}
