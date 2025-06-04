import React, { FC, SVGProps } from 'react';

const SwitchVerticalIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      {...props}
    >
      <path d="M2.625 8.75a.875.875 0 101.75 0V3.862l1.131 1.132a.875.875 0 101.238-1.238L4.119 1.131a.875.875 0 00-1.238 0L.256 3.756a.875.875 0 001.238 1.238l1.131-1.132V8.75zM11.375 5.25a.875.875 0 10-1.75 0v4.888L8.494 9.006a.875.875 0 00-1.238 1.238l2.625 2.625a.875.875 0 001.238 0l2.625-2.625a.875.875 0 00-1.238-1.238l-1.131 1.132V5.25z"></path>
    </svg>
  );
};

export default SwitchVerticalIcon;
