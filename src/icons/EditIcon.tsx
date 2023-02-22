import { FC, SVGProps } from 'react';

const EditIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
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
        d="M6.765 2.647H2.647C1.737 2.647 1 3.384 1 4.294v9.059C1 14.263 1.737 15 2.647 15h9.059c.91 0 1.647-.737 1.647-1.647V9.235m-1.165-7.753a1.647 1.647 0 012.33 2.33l-7.071 7.07h-2.33V8.553l7.071-7.07z"
      ></path>
    </svg>
  );
};

export default EditIcon;
