import { FC, SVGProps } from 'react';

const BuddyIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      fill="none"
      viewBox="0 0 48 48"
      stroke="currentColor"
      {...props}
    >
        <rect width="48" height="48" rx="24" fill="#EEF2FF" stroke='transparent'></rect>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.336"
        d="M24.0001 16.8639C24.6842 16.0888 25.6851 15.6 26.8001 15.6C28.862 15.6 30.5334 17.2714 30.5334 19.3333C30.5334 21.3952 28.862 23.0666 26.8001 23.0666C25.6851 23.0666 24.6842 22.5778 24.0001 21.8027M26.8001 32.4H15.6001V31.4666C15.6001 28.3738 18.1073 25.8666 21.2001 25.8666C24.2929 25.8666 26.8001 28.3738 26.8001 31.4666V32.4ZM26.8001 32.4H32.4001V31.4666C32.4001 28.3738 29.8929 25.8666 26.8001 25.8666C25.7801 25.8666 24.8238 26.1393 24.0001 26.6158M24.9334 19.3333C24.9334 21.3952 23.262 23.0666 21.2001 23.0666C19.1382 23.0666 17.4668 21.3952 17.4668 19.3333C17.4668 17.2714 19.1382 15.6 21.2001 15.6C23.262 15.6 24.9334 17.2714 24.9334 19.3333Z"
      ></path>
    </svg>
  );
};

export default BuddyIcon;
