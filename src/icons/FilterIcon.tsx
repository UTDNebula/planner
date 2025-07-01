import React, { FC, SVGProps } from 'react';

const FilterIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.875 3.875C3.875 3.39175 4.26675 3 4.75 3H15.25C15.7332 3 16.125 3.39175 16.125 3.875V6.49999C16.125 6.73206 16.0328 6.95462 15.8687 7.11871L11.75 11.2374V14.375C11.75 14.607 11.6578 14.8296 11.4937 14.9937L9.74371 16.7437C9.49346 16.9939 9.11711 17.0688 8.79014 16.9334C8.46318 16.7979 8.24999 16.4789 8.24999 16.125V11.2374L4.13128 7.11871C3.96719 6.95462 3.875 6.73206 3.875 6.49999V3.875Z"
        fill="#171717"
      />
    </svg>
  );
};

export default FilterIcon;
