import React, { FC, SVGProps } from 'react';

const PersonIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="16"
      fill="none"
      viewBox="0 0 13 16"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M9.61122 4.11111C9.61122 5.82933 8.21833 7.22222 6.50011 7.22222C4.78189 7.22222 3.389 5.82933 3.389 4.11111C3.389 2.39289 4.78189 1 6.50011 1C8.21833 1 9.61122 2.39289 9.61122 4.11111Z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M6.50011 9.55556C3.49322 9.55556 1.05566 11.9931 1.05566 15H11.9446C11.9446 11.9931 9.50699 9.55556 6.50011 9.55556Z"
      ></path>
    </svg>
  );
};

export default PersonIcon;
