import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Course } from '../../../modules/common/data';
import { Card } from './Card';
import { CourseSelectedAction } from './CourseSelector';

export type SidebarCourseContainerProps = {
  category: string; // TODO: Update to be more comprehensive
  courses: Course[];
  toggleCourseSelected: (course: Course, action: CourseSelectedAction) => void;
};

/**
 * Contains a list of courses from CourseSelector
 * that are part of the same category
 */
export function CardContainer({
  category,
  courses,
  toggleCourseSelected,
}: SidebarCourseContainerProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{category}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-col w-full">
          {courses.map((elm, index) => (
            <Card key={elm.id} props={elm} toggleCourseSelected={toggleCourseSelected} />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
