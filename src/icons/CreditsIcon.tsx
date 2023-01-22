import { SVGProps } from 'react';

export default function BackArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="3 0 15 27" fill="currentColor" {...props}>
      <path
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 9L18.5 9L13 3.5L13 9ZM6 2L14 2L20 8L20 20C20 21.1021 19.1034 22 18 22L6 22C4.88538 22 4 21.1021 4 20L4 4C4 2.89407 4.89437 2 6 2ZM15 18L15 16L6 16L6 18L15 18ZM18 14L18 12L6 12L6 14L18 14Z"
        fill="#1C2A6D"
      />
    </svg>
  );
}
