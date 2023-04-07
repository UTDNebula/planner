import { FC, SVGProps } from 'react';

const DeleteIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        d="M13.444 4.111l-.674 9.444A1.556 1.556 0 0111.218 15H4.782c-.816 0-1.494-.63-1.552-1.445l-.674-9.444m3.888 3.111v4.667m3.112-4.667v4.667m.777-7.778V1.778A.778.778 0 009.556 1H6.445a.778.778 0 00-.778.778V4.11m-3.89 0h12.445"
      ></path>
    </svg>
  );
};

export default DeleteIcon;
