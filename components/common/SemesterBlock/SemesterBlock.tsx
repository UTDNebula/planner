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
import { Add, DragIndicator, MoreVert } from '@material-ui/icons';
import { ScrollDirection } from '../SemesterBlockList';
import { useToggleableCard } from '../CourseCard/toggleableCard';
import CourseCard from '../CourseCard';
import styles from '../../../nebula-web/components/common/SemesterBlock/SemesterBlock.module.css';
import { Course } from '../../../modules/common/data';

/**
 * Component properties for an {@link SemesterBlock}.
 */
interface SemesterBlockProps {
  semesterCode: string;
  semesterTitle: string;
  courses: Course[];
  showOptions?: boolean;
  /**
   * If true, drag and drop functionality is removed from this block.
   *
   * TODO: Create separate block component that doesn't use drag and drop.
   */
  enabled?: boolean;
  displayDirection?: ScrollDirection;
  onAddCourse?: SemesterCallback;
  onShowSemesterInfo?: SemesterCallback;
  onClearSemester?: SemesterCallback;
  onRemoveSemester?: SemesterCallback;
}

/**
 * A callback notified when an action is taken on a SemesterBlock.
 */
export type SemesterCallback = (semesterCode: string) => void;

/**
 * Generate styles for a SemesterBlock.
 *
 * @param displayDirection The direction items will be laid out
 * @param enabled True if drag-and-drop functionality is allowed
 */
const useStyles = (displayDirection: ScrollDirection) => {
  return makeStyles((theme: Theme) => {
    const display = displayDirection === ScrollDirection.horizontally ? 'inline-block' : 'block';
    const rightMargin = displayDirection === ScrollDirection.horizontally ? theme.spacing(2) : 0;
    return createStyles({
      root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginRight: rightMargin,
        maxWidth: 480,
        width: '100%',
        display: display,
        verticalAlign: 'top',
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
    });
  })();
};

/**
 * A list of {@link CourseCard}s and options.
 */
function SemesterBlock(
  {
    semesterCode,
    semesterTitle,
    courses,
    showOptions = true,
    displayDirection = ScrollDirection.horizontally,
    enabled = false,
    onAddCourse = () => undefined,
    onShowSemesterInfo = () => undefined,
    onClearSemester = () => undefined,
    onRemoveSemester = () => undefined,
  }: SemesterBlockProps,
  ref: React.Ref<HTMLDivElement>,
) {
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

  const contents = courses.map(({ id, catalogCode, title, description, creditHours }, index) => (
    <CourseCard
      key={id}
      title={title}
      code={catalogCode}
      description={description}
      creditHours={creditHours}
      enabled={enabled}
    />
  ));

  const semesterHours = courses.reduce((total: number, course) => {
    total += course.creditHours;
    return total;
  }, 0);

  const { cardProps } = useToggleableCard(enabled);

  const classes = useStyles(displayDirection);

  // TODO: Disable if max credit load achieved
  const courseAddEnabled = true;

  // TODO: Support non-course displays
  return (
    <div className={styles.SemesterBlock} ref={ref}>
      <Paper component="header" className={classes.semesterHeader} {...cardProps}>
        <Icon className={classes.dragIndicator} hidden={!enabled}>
          <DragIndicator />
        </Icon>
        <Typography variant="h6" className={classes.semesterHeaderTitle}>
          {semesterTitle}
        </Typography>
        <IconButton
          aria-label="Add/transfer course"
          aria-controls="menu-add-course"
          hidden={!showOptions}
          disabled={!courseAddEnabled}
          onClick={handleAddCourse}
        >
          <Add />
        </IconButton>
        {enabled && (
          <IconButton
            aria-label="Semester options"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            hidden={!showOptions}
            disabled={!enabled}
            onClick={handleHeaderOptionsClick}
          >
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
      <div className="my-4 mx-5 font-bold text-subtitle1">{semesterHours} total credit hours</div>
    </div>
  );
}

export default React.forwardRef(SemesterBlock);
