import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import RequirementsList from './RequirementsList';

export default function RequirementsAccordion({
  data,
  toggleAccordion,
  accordian,
  contentSpace,
  setCarousel,
  setRequirementIdx,
  height,
}) {
  return (
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
  );
}
