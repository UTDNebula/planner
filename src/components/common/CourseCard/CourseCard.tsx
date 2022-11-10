import { MoreVert } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react';
/**
 * Component properties for a {@link CourseCard}.
 */
export interface CourseCardProps {
  /**
   * Id of course
   */

  id: string;
  /**
   * The subject and number for this course.
   *
   * {@example CS 3345}
   */
  code: string;

  /**
   * The formal title for this course.
   */
  title: string;

  /**
   * The long description for this course.
   */
  description: string;

  /**
   * The number of credit hours this course is worth.
   */
  creditHours: number;

  /**
   * The estimated amount of hours spent per week outside class.
   */
  estimatedWorkload?: number;

  /**
   * True if an options menu should be shown for this course.
   */
  enabled?: boolean;

  /**
   * A callback triggered when an a course should be removed from its container.
   */
  onOptionRemove?: (key: string, droppableId: string) => void;

  droppableCode?: string;

  /**
   * A callback triggered when a course should be swapped with another one
   */
  onOptionSwap?: (key: string) => void;

  isValid: boolean;
  prerequisites: string;
  override: boolean;
  updateOverride: (id: string) => void;
}

/**
 * Return a string version of the pluralized item based on a count.
 *
 * TODO: Find some more scalable way to do this task
 */
function pluralize(count?: number, item?: string, defaultCount = 0) {
  const trueCount = count !== undefined ? count : defaultCount;
  const trueItemText = item ? (trueCount === 0 || trueCount > 1 ? item + 's' : item) : '';
  return `${trueCount} ${trueItemText}`;
}

/**
 * A card showing course details.
 */
function CourseCard(
  {
    id,
    code,
    title,
    description,
    creditHours,
    estimatedWorkload,
    droppableCode,
    prerequisites,
    enabled = false,
    updateOverride,
    override,
    onOptionRemove,
    isValid,
    ...otherProps
  }: CourseCardProps,
  ref: React.Ref<HTMLElement>,
) {
  let tooltipReason;
  if (estimatedWorkload === undefined) {
    estimatedWorkload = 3 * creditHours;
    tooltipReason = `Estimated workload was determined by multiplying the number 
      of credit hours by 3.`;
  } else {
    tooltipReason = 'Estimated workload was determined based from user feedback.';
  }

  // TODO: Remove need for silly null/undefined checks
  const hoursText = pluralize(creditHours, 'credit hour', 3);
  const creditHoursText = `${hoursText}`;

  // TODO: Find a more robust way of doing this.
  // TODO: Only show outlines on desktop.
  const rootClasses = `p-4 m-2 w-[18rem] bg-white rounded-md hover:shadow-md border-gray-200 border-2 ${
    enabled ? 'shadow-sm' : 'shadow-none'
  } ${!isValid ? 'border-red-500 border-2' : null}
  `;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const showCardOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.debug('Showing course options');
    // TODO(planner): Show options for a course
    setAnchorEl(event.currentTarget);
  };

  const removeCourseHandler = () => {
    onOptionRemove(id, droppableCode);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const content = (
    <article ref={ref} className={rootClasses} {...otherProps}>
      <div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={removeCourseHandler}>Remove Course</MenuItem>
        </Menu>
      </div>
      <div className="flex">
        <div className="flex-1">
          <div className="text-lg font-bold">{code}</div>
          <div className="text-sm font-bold">{title}</div>
        </div>
        <div className="flex-0">
          <IconButton onClick={showCardOptions} size="large">
            <MoreVert />
          </IconButton>
        </div>
      </div>
      {/* <div className="text-body2 break-words">{description}</div> */}
      <div className="">
        <span className="text-sm">{creditHoursText}</span>
        <span>
          <Tooltip title={prerequisites} placement="right-end" className="text-md">
            <InfoIcon fontSize="inherit" color="inherit" className="ml-2 text-xs text-gray-600" />
          </Tooltip>
        </span>
        {isValid === false && !override && (
          <span className="ml-2">
            <Tooltip title={'Mark prerequisite met'}>
              <IconButton onClick={() => updateOverride(id)}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          </span>
        )}
        {isValid === true && override && (
          <span className="ml-2">
            <Tooltip title={'Mark prerequisite not met'}>
              <IconButton onClick={() => updateOverride(id)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </span>
        )}
      </div>
    </article>
  );

  return (
    <>
      {isValid ? (
        content
      ) : (
        <Tooltip
          title={'Error: Prerequisites not met for this course'}
          componentsProps={{
            tooltip: {
              className: 'p-2 text-[13px] bg-white text-defaultText border-2  rounded-xl',
            },
          }}
          followCursor
          placement="top-start"
        >
          {content}
        </Tooltip>
      )}
    </>
  );
}

export default React.forwardRef(CourseCard);
