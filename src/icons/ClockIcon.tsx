import type { FC, SVGProps } from 'react';

const ClockIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M8 4.889V8l2.333 2.333M15 8A7 7 0 111 8a7 7 0 0114 0z"
      ></path>
    </svg>
  );
};

export default ClockIcon;
