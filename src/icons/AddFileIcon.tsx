import { FC, SVGProps } from 'react';

const AddFileIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      fill="none"
      viewBox="0 0 14 16"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M4.667 8.778h4.666M7 6.444v4.667M10.889 15H3.11c-.859 0-1.555-.696-1.555-1.556V2.556C1.556 1.696 2.252 1 3.11 1h4.345c.206 0 .404.082.55.228l4.21 4.21a.778.778 0 01.228.55v7.456c0 .86-.696 1.556-1.555 1.556z"
      ></path>
    </svg>
  );
};

export default AddFileIcon;
