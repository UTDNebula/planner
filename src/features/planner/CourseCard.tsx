import { Card, CardContent, createStyles, makeStyles, Menu, Theme, colors } from '@material-ui/core';
import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

/**
 * Component properties for a {@link CourseCard}.
 */
export interface CourseCardProps {
  code: string;
  title: string;
  description: string;

  /**
   * The number of credit hours this course is worth. 
   */
  creditHours?: number;

  /**
   * The estimated amount of hours spent per week outside class.
   */
  estimatedWorkload?: number;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 2,
  },
  courseTitle: {
    fontSize: 12,
  },
  courseCode: {
    fontSize: 16,
  },
  popupIcon: {
    marginLeft: theme.spacing(0.5),
    fontSize: 16,
    color: colors.grey[700],
  },
}));

/**
 * Return a string version of the pluralized item based on a count.
 * 
 * TODO: Find some more scalable way to do this task
 */
function pluralize(count?: number, item?: string, defaultCount: number = 0) {
  const trueCount = count ? count : defaultCount;
  const trueItemText = item
    ? trueCount === 0 || trueCount > 1
      ? item + 's'
      : item
    : '';
  return `${trueCount} ${trueItemText}`;
}

/**
 * A card showing course details.
 */
export default function CourseCard(props: CourseCardProps) {
  const { code, title, description, creditHours, estimatedWorkload } = props;
  const classes = useStyles();

  // TODO: Probably replace this with a pure CSS version  
  const [showDialog, setShowDialog] = React.useState(false);
  const [infoAnchorElement, setInfoAnchorElement] = React.useState<HTMLElement | null>(null);
  const handleInfoHoverStart = (event: React.MouseEvent<HTMLElement>) => {
    setInfoAnchorElement(event.currentTarget);
    setShowDialog(true);
  };
  const handleInfoHoverEnd = () => {
    setInfoAnchorElement(null);
    setShowDialog(false);
  }

  // TODO: Remove need for silly null/undefined checks
  const hoursText = pluralize(creditHours, 'credit hour', 3);
  const workloadText = pluralize(estimatedWorkload, 'hour');
  const creditHoursText = `${hoursText} | Est. ${workloadText}/week`;
  const metadata = (
    <div>
      <span>{creditHoursText}</span>
      <span
        onMouseEnter={handleInfoHoverStart}
        onMouseLeave={handleInfoHoverEnd}>
        <InfoIcon className={classes.popupIcon} />
        {showDialog && (
          <Menu
            id={`menu-course-${code}`}
            anchorEl={infoAnchorElement}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={showDialog}
            onClose={handleInfoHoverEnd}>
            <div className="px-2">
              This estimated workload is determined based on user feedback.
              </div>
          </Menu>
        )}
      </span>
    </div>
  );

  return (
    <Card className={classes.root}>
      {/* TODO: Add option to show letter grade */}
      <CardContent>
        <div className="text-headline6 font-bold">{code}</div>
        <div className="text-subtitle1">{title}</div>
        <div className="text-body2">{description}</div>
        {metadata}
        {/* <Typography className="headline2 font-bold" component="h2">{code}</Typography> */}
        {/* <Typography variant="subtitle1" className={classes.courseTitle}>{title}</Typography> */}
        {/* <Typography variant="body2" className={classes.courseTitle}>{description}</Typography> */}
      </CardContent>
    </Card>
  );
}