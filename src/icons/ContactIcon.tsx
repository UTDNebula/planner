import type { FC, SVGProps } from 'react';

const ContactIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 7.83534V9.39089M10 12.502H10.0078M16.7028 5.48981C16.5436 5.49789 16.3834 5.50197 16.2222 5.50197C13.8318 5.50197 11.6512 4.6033 9.99995 3.12537C8.34871 4.60324 6.16819 5.50188 3.77778 5.50188C3.6166 5.50188 3.45638 5.49779 3.29721 5.48972C3.10321 6.2392 3 7.02521 3 7.83534C3 12.1843 5.97447 15.8385 10 16.8746C14.0255 15.8385 17 12.1843 17 7.83534C17 7.02525 16.8968 6.23926 16.7028 5.48981Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ContactIcon;
