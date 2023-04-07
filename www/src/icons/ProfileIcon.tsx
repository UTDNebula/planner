import { SVGProps } from 'react';

export default function ProfileIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.1111 4.11111C10.1111 5.82933 8.71821 7.22222 6.99999 7.22222C5.28177 7.22222 3.88888 5.82933 3.88888 4.11111C3.88888 2.39289 5.28177 1 6.99999 1C8.71821 1 10.1111 2.39289 10.1111 4.11111Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99999 9.55556C3.9931 9.55556 1.55554 11.9931 1.55554 15H12.4444C12.4444 11.9931 10.0069 9.55556 6.99999 9.55556Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
