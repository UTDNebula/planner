import React, { SVGProps } from 'react';

export default function HomeIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 8L2.55556 6.44444M2.55556 6.44444L8 1L13.4444 6.44444M2.55556 6.44444V14.2222C2.55556 14.6518 2.90378 15 3.33333 15H5.66667M13.4444 6.44444L15 8M13.4444 6.44444V14.2222C13.4444 14.6518 13.0962 15 12.6667 15H10.3333M5.66667 15C6.09622 15 6.44444 14.6518 6.44444 14.2222V11.1111C6.44444 10.6816 6.79267 10.3333 7.22222 10.3333H8.77778C9.20733 10.3333 9.55556 10.6816 9.55556 11.1111V14.2222C9.55556 14.6518 9.90378 15 10.3333 15M5.66667 15H10.3333"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
