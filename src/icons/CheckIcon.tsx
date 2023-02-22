import { FC, SVGProps } from 'react';

const CheckIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="12"
      fill="none"
      viewBox="0 0 16 12"
      stroke="currentColor"
      {...props}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.38 1.085c.23.21.244.566.035.795l-8.25 9a.562.562 0 01-.813.018l-3.75-3.75a.562.562 0 11.796-.796l3.334 3.335 7.853-8.567a.563.563 0 01.795-.035z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default CheckIcon;
