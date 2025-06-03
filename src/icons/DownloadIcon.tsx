import React, { FC, SVGProps } from 'react';

const DownloadIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
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
        d="M1 11.5v.875A2.625 2.625 0 003.625 15h8.75A2.625 2.625 0 0015 12.375V11.5M11.5 8L8 11.5m0 0L4.5 8M8 11.5V1"
      ></path>
    </svg>
  );
};

export default DownloadIcon;
