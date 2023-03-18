import type { FC, SVGProps } from 'react';

const FeedbackIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.11111 6.88888H13.8889M6.11111 9.99999H9.22222M10 16.2222L6.88889 13.1111H4.55556C3.69645 13.1111 3 12.4147 3 11.5555V5.33333C3 4.47422 3.69645 3.77777 4.55556 3.77777H15.4444C16.3036 3.77777 17 4.47422 17 5.33333V11.5555C17 12.4147 16.3036 13.1111 15.4444 13.1111H13.1111L10 16.2222Z"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FeedbackIcon;
