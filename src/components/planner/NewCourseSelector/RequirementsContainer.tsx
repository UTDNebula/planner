import React, { useRef, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import RequirementsList from './RequirementsList';
import RequirementContainer from './RequirementContainer';

export default function RequirementsContainer({ data }) {
  const [carousel, setCarousel] = React.useState(0);
  const [accordian, setAccordian] = React.useState(false);
  const [requirementIdx, setRequirementIdx] = React.useState(0);
  const [height, setHeight] = useState('0px');

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setAccordian((prevState) => !prevState);
    setHeight(accordian ? '0px' : `${contentSpace.current.scrollHeight + 20}px`);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className={` px-4 py-3 rounded-md relative z-30 duration-500 ${
            carousel && '-translate-x-full'
          } bg-white`}
        >
          <div className="w-full">
            <button className="flex flex-row w-full justify-between px-2" onClick={toggleAccordion}>
              <div className="">{data.name}</div>
              {accordian ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>

            <div
              ref={contentSpace}
              className={`overflow-auto duration-500 ease-in-out ${accordian && 'pt-4'}`}
              style={{ height }}
            >
              <RequirementsList
                data={data.requirements}
                updateCarousel={(idx) => {
                  setCarousel(1);
                  setRequirementIdx(idx);
                }}
              />
            </div>
          </div>
        </div>

        <RequirementContainer
          data={data.requirements}
          requirementIdx={requirementIdx}
          accordian={accordian}
          carousel={carousel}
          setCarousel={setCarousel}
        />
      </div>
    </div>
  );
}
