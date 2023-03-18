import type { FC, SVGProps } from 'react';

const ColorSwatchIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M4.111 15A3.111 3.111 0 011 11.889V2.556C1 1.696 1.696 1 2.556 1h3.11c.86 0 1.556.696 1.556 1.556v9.333A3.111 3.111 0 014.112 15zm0 0h9.333c.86 0 1.556-.696 1.556-1.556v-3.11c0-.86-.696-1.556-1.556-1.556h-1.822m-4.4-4.4l1.289-1.289a1.556 1.556 0 012.2 0l2.2 2.2a1.556 1.556 0 010 2.2l-6.6 6.6m-2.2-2.2h.008"
      ></path>
    </svg>
  );
};

export default ColorSwatchIcon;
