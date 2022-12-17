import useSearch from '@/components/search/search';
import SearchBar from '@/components/search/SearchBar';
import React, { useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function RequirementsContainer({ data }) {
  const [carousel, setCarousel] = React.useState(0);
  const [accordian, setAccordian] = React.useState(false);
  const [requirementIdx, setRequirementIdx] = React.useState(0);
  const [height, setHeight] = useState('0px');

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setAccordian((prevState) => !prevState);
    setHeight(accordian ? '0px' : `${contentSpace.current.scrollHeight}px`);
  }

  // TODO: Change this later
  const getCourses = async () => {
    return Object.keys(data[requirementIdx].courses);
  };

  const { results, updateQuery, getResults, err } = useSearch({
    getData: getCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm.toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const test = Object.values(data[requirementIdx].courses);

  const numCredits = test.length > 0 ? test.reduce((prev, curr) => prev + curr) : 0;
  return (
    <div className="relative">
      <div className={` absolute z-30 duration-500 ${carousel && '-translate-x-full'} bg-white`}>
        <div className="w-full  overflow-y-scroll">
          <button className="flex flex-row w-full justify-between" onClick={toggleAccordion}>
            <div>Major Requirements</div>
            {accordian ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          <div
            ref={contentSpace}
            className="overflow-auto transition-max-height duration-300 ease-in-out"
            style={{ maxHeight: `${height}` }}
          >
            {data.map((elm, idx) => (
              <button
                className="w-full"
                key={idx}
                onClick={() => {
                  setCarousel(1);
                  setRequirementIdx(idx);
                }}
              >
                <div className="flex justify-between px-10 py-2" key={idx}>
                  <div>{`Req ${idx}`}</div>
                  <div>{elm.isfilled ? 'Complete' : 'Incomplete'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={` absolute flex flex-col `}>
        <div className="flex flex-row items-start justify-start">
          <button onClick={() => setCarousel(0)}>
            <svg
              width="30"
              height="27"
              viewBox="0 0 30 27"
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
            <div>{data[requirementIdx].name}</div>

            <div>{`${numCredits}/${data[requirementIdx].hours} credits`}</div>
          </div>
        </div>
        <div>
          CS guided electives are 4000 level CS courses approved by the students CS advisor. The
          following courses may be used as guided electives without the explicit approval of an
          advisor.
        </div>
        <SearchBar updateQuery={updateQuery} />
        <div className="border-2 border-blue-500">
          {results.map((elm, idx) => (
            <div key={idx}>{elm}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
