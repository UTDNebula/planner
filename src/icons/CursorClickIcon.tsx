import React, { FC, SVGProps } from 'react';

const CursorClickIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
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
        d="M11.059 11.059L9.482 15 6.33 6.33 15 9.482l-3.941 1.577zm0 0L15 15M4.902 1l.612 2.284m-2.23 2.23L1 4.902m9.231-2.474L8.559 4.1M4.1 8.56L2.428 10.23"
      ></path>
    </svg>
  );
};

export default CursorClickIcon;
