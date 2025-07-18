import React, { SVGProps } from 'react';

export default function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="currentColor"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M8.303 1.025c-.332-1.367-2.274-1.367-2.606 0a1.34 1.34 0 01-2 .828c-1.201-.731-2.575.643-1.844 1.843a1.34 1.34 0 01-.828 2c-1.367.333-1.367 2.275 0 2.607a1.34 1.34 0 01.828 2c-.731 1.201.643 2.575 1.843 1.844a1.34 1.34 0 012 .828c.333 1.367 2.275 1.367 2.607 0a1.34 1.34 0 012-.828c1.201.731 2.575-.643 1.844-1.843a1.34 1.34 0 01.828-2c1.367-.333 1.367-2.275 0-2.607a1.34 1.34 0 01-.828-2c.731-1.201-.643-2.575-1.843-1.844a1.34 1.34 0 01-2-.828zM7 9.625a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
