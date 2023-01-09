import { DegreeRequirement } from '../types';

export default function RequirementContainerHeader({
  data,
  numCredits,
  setCarousel,
}: {
  data: DegreeRequirement;
  numCredits: number;
  setCarousel: (state: boolean) => void;
}) {
  return (
    <div className="w-full flex flex-row items-start justify-start">
      <button onClick={() => setCarousel(false)}>
        <svg
          width="30"
          height="27"
          viewBox="0 -12 60 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.4504 26.0646C14.0988 26.4162 13.622 26.6136 13.1248 26.6136C12.6276 26.6136 12.1508 26.4162 11.7991 26.0646L0.548982 14.8145C0.197469 14.4629 0 13.986 0 13.4889C0 12.9917 0.197469 12.5148 0.548982 12.1632L11.7991 0.91306C12.1528 0.571509 12.6264 0.382518 13.118 0.38679C13.6097 0.391062 14.0799 0.588256 14.4276 0.935901C14.7752 1.28355 14.9724 1.75383 14.9767 2.24545C14.981 2.73708 14.792 3.21071 14.4504 3.56435L6.40094 11.6138H28.125C28.6223 11.6138 29.0992 11.8114 29.4508 12.163C29.8025 12.5146 30 12.9916 30 13.4889C30 13.9861 29.8025 14.4631 29.4508 14.8147C29.0992 15.1663 28.6223 15.3639 28.125 15.3639H6.40094L14.4504 23.4134C14.8019 23.765 14.9994 24.2418 14.9994 24.739C14.9994 25.2362 14.8019 25.713 14.4504 26.0646Z"
            fill="#1C2A6D"
          />
        </svg>
      </button>
      <div>
        <div className="text-base">{data.name}</div>
        <div className="text-[10px]">{`${numCredits}/${data.hours} credits`}</div>
      </div>
    </div>
  );
}
