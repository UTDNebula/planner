import type { FC, SVGProps } from 'react';

const PencilIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      {...props}
    >
      <path d="M10.586.586a2 2 0 112.828 2.828l-.793.793L9.793 1.38l.793-.793zM8.379 2.793L0 11.172V14h2.828l8.38-8.379-2.83-2.828z"></path>
    </svg>
  );
};

export default PencilIcon;
