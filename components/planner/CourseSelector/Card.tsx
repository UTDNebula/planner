import InfoIcon from '@mui/icons-material/Info';
import { AccordionDetails, AccordionSummary } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import withStyles from '@mui/styles/withStyles';
import { useState } from 'react';

import { Course } from '../../../modules/common/data';
import { CourseSelectedAction } from './CourseSelector';

const Accordion = withStyles({
  root: {
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

export type CardProps = {
  props: Course;
  toggleCourseSelected: (course: Course, action: CourseSelectedAction) => void;
};

/**
 * Card displayed in CourseSelector.tsx
 * TODO: Figure out final functionality of this component
 */
export function Card({ props, toggleCourseSelected }: CardProps) {
  const { catalogCode, title, description, creditHours } = props;
  const [checkboxState, setCheckboxState] = useState(false);

  const handleChange = (event) => {
    event.stopPropagation();
    checkboxState ? toggleCourseSelected(props, 'Remove') : toggleCourseSelected(props, 'Add');
    setCheckboxState(!checkboxState);
  };

  return (
    <Accordion className="my-2 w-full bg-white rounded-xl hover:bg-gray-100 border-gray-200 border-2 ">
      <AccordionSummary
        className="flex flex-row"
        expandIcon={<InfoIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {/* <Checkbox onClick={handleChange} /> */}
        <div className=""> {catalogCode} </div>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col">
        <div className="text-xl">{title}</div>
        <div className="text-md"> Description: </div>
        <div className="text-xs">{description}</div>
      </AccordionDetails>
    </Accordion>
  );
}
