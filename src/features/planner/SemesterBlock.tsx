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
import { Droppable } from 'react-beautiful-dnd';
import CourseCard from './CourseCard';
import { Course } from './DegreePlannerChrome';
import { DragIndicator, MoreVert } from '@material-ui/icons';

/**
 * Component properties for an {@link SemesterBlock}.
 */
interface SemesterBlockProps {
  semesterCode: string;
  semesterTitle: string;
  courses: Course[];
  onAddCourse: SemesterCallback;
  onShowSemesterInfo: SemesterCallback;
  onClearSemester: SemesterCallback;
  onRemoveSemester: SemesterCallback;
}

type SemesterCallback = (semesterCode: string) => void;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxWidth: 360,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  semesterHeaderIcon: {
    padding: theme.spacing(1),
  },
  semesterHeader: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  semesterHeaderTitle: {
    flex: 1,
    paddingTop: 6,
    fontSize: theme.typography.h6.fontSize,
  },
  dragIndicator: {
    margin: theme.spacing(1),
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
export default function SemesterBlock(props: SemesterBlockProps) {
  const {
    semesterCode,
    semesterTitle,
    courses,
    onAddCourse,
    onShowSemesterInfo,
    onClearSemester,
    onRemoveSemester
  } = props;

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

  const courseItems = courses.map(({ id, catalogCode, title, description }, index) => {
    return (
      <CourseCard key={id}
        id={id}
        index={index}
        code={catalogCode}
        title={title}
        description={description} />
    );
  });

  const classes = useStyles();

  // TODO: Support non-course displays
  return (
    <div className={classes.root}>
      <Paper component="header" className={classes.semesterHeader}>
        <Icon className={classes.dragIndicator}>
          <DragIndicator />
        </Icon>
        <Typography variant="h6" className={classes.semesterHeaderTitle}>
          {semesterTitle}
        </Typography>
        <IconButton
          aria-label="Semester options"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleHeaderOptionsClick}>
          <MoreVert />
        </IconButton>
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
      <Droppable droppableId={semesterCode}>
        {(provided) =>
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {courseItems}
            {provided.placeholder}
          </div>
        }
      </Droppable>
    </div>
  );
}
