import React, { SVGProps } from 'react';

export default function LockIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.125 6.875H2.875V6.125V4.375C2.875 2.37297 4.49797 0.75 6.5 0.75C8.50203 0.75 10.125 2.37297 10.125 4.375V6.125V6.875H10.875C11.4273 6.875 11.875 7.32272 11.875 7.875V12.25C11.875 12.8023 11.4273 13.25 10.875 13.25H2.125C1.57272 13.25 1.125 12.8023 1.125 12.25V7.875C1.125 7.32272 1.57272 6.875 2.125 6.875ZM9.125 6.875H9.875V6.125V4.375C9.875 2.51104 8.36396 1 6.5 1C4.63604 1 3.125 2.51104 3.125 4.375V6.125V6.875H3.875H9.125Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
