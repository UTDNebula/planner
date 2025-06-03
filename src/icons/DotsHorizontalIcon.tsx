import React, { FC, SVGProps } from 'react';

const DotsHorizontalIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="4" viewBox="0 0 14 4" {...props}>
      <path
        fill="currentColor"
        d="M3.5 2A1.75 1.75 0 110 2a1.75 1.75 0 013.5 0zM8.75 2a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zM12.25 3.75a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5z"
      ></path>
    </svg>
  );
};

export default DotsHorizontalIcon;
