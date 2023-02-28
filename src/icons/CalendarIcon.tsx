import { FC, SVGProps } from 'react';

const CalendarIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      fill="none"
      viewBox="0 0 17 16"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M5.38889 4.11111V1M11.6111 4.11111V1M4.61111 7.22222H12.3889M3.05556 15H13.9444C14.8036 15 15.5 14.3036 15.5 13.4444V4.11111C15.5 3.252 14.8036 2.55556 13.9444 2.55556H3.05556C2.19645 2.55556 1.5 3.252 1.5 4.11111V13.4444C1.5 14.3036 2.19645 15 3.05556 15Z"
      ></path>
    </svg>
  );
};

export default CalendarIcon;
