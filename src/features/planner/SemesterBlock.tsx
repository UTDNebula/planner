import React from 'react';
import {
  makeStyles,
  createStyles,
  Icon,
  IconButton,
  MenuItem,
  Menu,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { DragIndicator, MoreVert } from '@material-ui/icons';
import { Droppable } from 'react-beautiful-dnd';
import CourseCard from './CourseCard';
import DraggableCourseCard from './DraggableCourseCard';
import { Course } from '../../app/data';

/**
 * Component properties for an {@link SemesterBlock}.
 */
interface SemesterBlockProps {
  semesterCode: string;
  semesterTitle: string;
  courses: Course[];
  showDragHandle?: boolean;
  showOptions?: boolean;
  /**
   * If true, drag and drop functionality is removed from this block.
   * 
   * TODO: Create separate block component that doesn't use drag and drop.
   */
  displayOnly?: boolean;
  onAddCourse: SemesterCallback;
  onShowSemesterInfo: SemesterCallback;
  onClearSemester: SemesterCallback;
  onRemoveSemester: SemesterCallback;
}

/**
 * A callback notified when an action is taken on a SemesterBlock.
 */
export type SemesterCallback = (semesterCode: string) => void;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxWidth: 480,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  semesterHeader: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    height: 48,
  },
  semesterHeaderTitle: {
    flex: 1,
    paddingTop: 6,
    paddingLeft: theme.spacing(2),
    fontSize: theme.typography.h6.fontSize,
  },
  dragIndicator: {
    // TODO: Find out why the styling for this looks off
    height: 36,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  courseTitle: {
    fontSize: 12,
  },
  courseCode: {
    fontSize: 16,
  },
}));

/**
 * A list of {@link CourseCard}s and options.
 */
export default function SemesterBlock({
  semesterCode,
  semesterTitle,
  courses,
  showDragHandle,
  showOptions = true,
  displayOnly,
  onAddCourse,
  onShowSemesterInfo,
  onClearSemester,
  onRemoveSemester
}: SemesterBlockProps) {

  const [optionsMenuShowing, setOptionsMenuShowing] = React.useState(false);
  const [optionsMenuAnchor, setOptionsMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleOptionsMenuClose = () => {
    setOptionsMenuAnchor(null);
    setOptionsMenuShowing(false);
  };

  const handleHeaderOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsMenuAnchor(event.currentTarget);
    setOptionsMenuShowing(true);
  };

  const handleAddCourse = () => {
    onAddCourse(semesterCode);
    setOptionsMenuShowing(false);
  };

  const handleShowSemesterInfo = () => {
    onShowSemesterInfo(semesterCode);
    setOptionsMenuShowing(false);
  };

  const handleRemoveSemester = () => {
    onRemoveSemester(semesterCode);
    setOptionsMenuShowing(false);
  };

  const handleClearSemester = () => {
    onClearSemester(semesterCode);
    setOptionsMenuShowing(false);
  };

  const contents = courses.map(({ id, catalogCode, title, description }, index) => (
    <DraggableCourseCard
      key={id}
      id={id}
      index={index}
      code={catalogCode}
      title={title}
      description={description}
      showOptions={showOptions}
    />
  ));

  const classes = useStyles();

  // TODO: Support non-course displays
  return (
    <Droppable droppableId={semesterCode}>
      {(provided) => (
        <div className={classes.root} ref={provided.innerRef}>
          <Paper component="header" className={classes.semesterHeader}>
            <Icon className={classes.dragIndicator} hidden={!showDragHandle}>
              <DragIndicator />
            </Icon>
            <Typography variant="h6" className={classes.semesterHeaderTitle}>
              {semesterTitle}
            </Typography>
            {!displayOnly && (
              <IconButton
                aria-label="Semester options"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                hidden={!showOptions}
                disabled={displayOnly}
                onClick={handleHeaderOptionsClick}>
                <MoreVert />
              </IconButton>
            )}
            <Menu
              id="menu-semester-options"
              anchorEl={optionsMenuAnchor}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={optionsMenuShowing}
              onClose={handleOptionsMenuClose}
            >
              <MenuItem onClick={handleAddCourse}>Add/transfer course</MenuItem>
              <MenuItem onClick={handleShowSemesterInfo}>Show semester info</MenuItem>
              <MenuItem onClick={handleClearSemester}>Clear semester</MenuItem>
              <MenuItem onClick={handleRemoveSemester}>Remove semester</MenuItem>
            </Menu>
          </Paper>
          {contents}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
