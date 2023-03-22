import { SVGProps } from 'react';

export default function UnfilledWarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      fill="none"
      viewBox="0 0 16 17"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M8 5.602v3.11m0 3.112h.008M15 8.713a7 7 0 11-14 0 7 7 0 0114 0z"
      ></path>
    </svg>
    // <svg
    //   width="20"
    //   height="20"
    //   viewBox="0 0 20 20"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   {...props}
    // >
    //   <path
    //     d="M16.25 10C16.25 13.4518 13.4518 16.25 10 16.25C6.54822 16.25 3.75 13.4518 3.75 10C3.75 6.54822 6.54822 3.75 10 3.75C13.4518 3.75 16.25 6.54822 16.25 10ZM10 15.125C10.8975 15.125 11.625 14.3975 11.625 13.5C11.625 12.6025 10.8975 11.875 10 11.875C9.10254 11.875 8.375 12.6025 8.375 13.5C8.375 14.3975 9.10254 15.125 10 15.125ZM10 4.875C9.10254 4.875 8.375 5.60254 8.375 6.5V10C8.375 10.8975 9.10254 11.625 10 11.625C10.8975 11.625 11.625 10.8975 11.625 10V6.5C11.625 5.60254 10.8975 4.875 10 4.875Z"
    //     stroke="currentColor"
    //     fill="currentColor"
    //     strokeWidth="1.5"
    //   />
    // </svg>
  );
}
