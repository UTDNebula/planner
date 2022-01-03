import {
  AccordionActions,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Checkbox,
  ButtonGroup,
} from '@material-ui/core';
import { CourseCardProps } from '../../common/CourseCard';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { CourseSelectedAction } from './CourseSelector';
import { Course } from '../../../modules/common/data';

export type CardProps = {
  props: Course;
  toggleCourseSelected: (course: Course, action: CourseSelectedAction) => void;
};
// Handle all of Card State inside Card
// except isDisabled (occurs once card is placed inside Droppable)
export function Card({ props, toggleCourseSelected }: CardProps) {
  const { catalogCode, title, description, creditHours } = props;
  const [checkboxState, setCheckboxState] = useState(false);

  const handleChange = (event) => {
    event.stopPropagation();
    checkboxState ? toggleCourseSelected(props, 'Remove') : toggleCourseSelected(props, 'Add');
    setCheckboxState(!checkboxState);
  };
  return (
    <Accordion className="w-full">
      <AccordionSummary
        className="flex flex-row"
        expandIcon={<InfoIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Checkbox onClick={handleChange} />
        <div> {catalogCode} </div>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col">
        <div>{title}</div>
        <div>{description}</div>
        <div>{creditHours}</div>
      </AccordionDetails>
    </Accordion>
  );
}
