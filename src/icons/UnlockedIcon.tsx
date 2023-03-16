import { SVGProps } from 'react';

export default function UnlockedIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.38889 7.22222V4.11111C4.38889 2.39289 5.78178 1 7.5 1C9.21822 1 10.6111 2.39289 10.6111 4.11111M7.5 10.3333V11.8889M2.83333 15H12.1667C13.0258 15 13.7222 14.3036 13.7222 13.4444V8.77778C13.7222 7.91867 13.0258 7.22222 12.1667 7.22222H2.83333C1.97422 7.22222 1.27778 7.91867 1.27778 8.77778V13.4444C1.27778 14.3036 1.97422 15 2.83333 15Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
      />
    </svg>
  );
}
