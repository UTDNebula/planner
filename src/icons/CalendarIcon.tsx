import type { FC, SVGProps } from 'react';

const CalendarIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
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
        d="M4.889 4.111V1m6.222 3.111V1m-7 6.222h7.778M2.556 15h10.888c.86 0 1.556-.696 1.556-1.556V4.111c0-.859-.696-1.555-1.556-1.555H2.556C1.696 2.556 1 3.252 1 4.11v9.333C1 14.304 1.696 15 2.556 15z"
      ></path>
    </svg>
  );
};

export default CalendarIcon;
