import React, { FC, SVGProps } from 'react';

const DeleteIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 8C15 11.866 11.866 15 8 15M15 8C15 4.13401 11.866 1 8 1M15 8H1M8 15C4.13401 15 1 11.866 1 8M8 15C9.28866 15 10.3333 11.866 10.3333 8C10.3333 4.13401 9.28866 1 8 1M8 15C6.71134 15 5.66667 11.866 5.66667 8C5.66667 4.13401 6.71134 1 8 1M1 8C1 4.13401 4.13401 1 8 1"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DeleteIcon;
