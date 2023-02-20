import { FC, SVGProps } from 'react';

const ClipboardListIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeWidth="1.67"
        d="M4.667 2.556H3.11c-.859 0-1.555.696-1.555 1.555v9.333c0 .86.696 1.556 1.555 1.556h7.778c.859 0 1.555-.696 1.555-1.556V4.111c0-.859-.696-1.555-1.555-1.555H9.333m-4.666 0c0 .859.696 1.555 1.555 1.555h1.556c.859 0 1.555-.696 1.555-1.555m-4.666 0c0-.86.696-1.556 1.555-1.556h1.556c.859 0 1.555.696 1.555 1.556M7 8h2.333M7 11.111h2.333M4.667 8h.007m-.007 3.111h.007"
      ></path>
    </svg>
  );
};

export default ClipboardListIcon;
