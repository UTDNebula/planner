import React, { FC, SVGProps } from 'react';

const ArchiveIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
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
        d="M2.556 4.889h10.888m-10.888 0a1.556 1.556 0 110-3.111h10.888a1.556 1.556 0 110 3.11m-10.888 0v7.779c0 .859.696 1.555 1.555 1.555h7.778c.859 0 1.555-.696 1.555-1.555V4.889M6.444 8h3.112"
      ></path>
    </svg>
  );
};

export default ArchiveIcon;
