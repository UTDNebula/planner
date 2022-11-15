import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';
import { MoreVert } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  getGradeColors,
  reformatArray,
  sortByGrades,
  splitGradeData,
} from '../../planner/GradeChart/GradeChart';
import courseData from '../../planner/GradeChart/Spring2020data';

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
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sortedRMP, setSortedRMP] = React.useState(false);

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

  const toggleSort = () => {
    setSortedRMP(!sortedRMP);
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
      <div className="flex">
        <div className="flex-1">
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
        <span className="flex-0">
          <Tooltip title="View grades" placement="bottom">
            <IconButton onClick={() => showModal(true)} size="large">
              <AssignmentIcon />
            </IconButton>
          </Tooltip>
        </span>
      </div>
    </article>
  );

  const showModal = (visible: boolean | ((prevState: boolean) => boolean)) => {
    setModalOpen(visible);
  };

  const renderGraph = (course) => {
    const grades = course['grades'];
    const formattedGrades = reformatArray(grades);
    const sortedGrades = sortByGrades(formattedGrades);
    const { keys, values } = splitGradeData(sortedGrades);
    const colors = getGradeColors(keys);
    // console.log(keys);
    const barGraphState = {
      labels: keys,
      datasets: [
        {
          label: 'Grades',
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2,
          data: values,
        },
      ],
    };

    return (
      <div style={{ width: '80%' }}>
        <Bar
          data={barGraphState}
          options={{
            title: {
              display: true,
              text: course['professor'] + ' Section ' + course['section'],
              fontSize: 15,
            },
            legend: {
              display: false,
            },
          }}
        />
      </div>
    );
  };

  const displayClassInfo = () => {
    if (!courseData[code])
      return <div style={{ textAlign: 'center' }}>No course data available.</div>;
    let data = courseData[code];
    if (sortedRMP && courseData[code]) {
      data = JSON.parse(JSON.stringify(courseData[code]));
      data.sort(function (a: { [x: string]: number }, b: { [x: string]: number }) {
        if (!a['overall_rating']) return 1;
        if (!b['overall_rating']) return -1;
        return b['overall_rating'] - a['overall_rating'];
      });
    }

    return (
      <>
        <div>
          {data.map((course, i: React.Key) => (
            <div key={i} style={{ display: 'flex' }}>
              <div style={{ width: '20%', margin: 'auto', textAlign: 'center' }}>
                <p>RMP Rating</p>
                {course['overall_rating'] ? (
                  <h1
                    style={{
                      borderRadius: '30px',
                      width: '120px',
                      maxWidth: '120px',
                      margin: '0 auto',
                      fontSize: 30,
                      marginTop: 10,
                      backgroundColor:
                        course['overall_rating'] > 3.5
                          ? '#95ff95'
                          : course['overall_rating'] > 2.5
                          ? '#ffda6c'
                          : '#ff7373',
                    }}
                  >
                    {course['overall_rating']}
                  </h1>
                ) : (
                  <h1>N/A</h1>
                )}
                {course['total_ratings'] ? (
                  <h3 style={{ fontSize: '20px' }}>{course['total_ratings']} Reviews</h3>
                ) : (
                  <h3 style={{ fontSize: '20px' }}>0 Reviews</h3>
                )}
              </div>
              {renderGraph(course)}
            </div>
          ))}
        </div>
      </>
    );
  };

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
      <Modal
        open={modalOpen}
        onClose={() => showModal(false)}
        aria-labelledby="stats-modal-title"
        aria-describedby="stats-modal-description"
      >
        <div
          style={{
            padding: '3px',
            cursor: 'pointer',
            outline: 'none',
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            maxWidth: '800px',
            maxHeight: '600px',
            overflow: 'auto',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '10px',
          }}
        >
          <div style={{ margin: '20px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '21%' }}>
                <FormControlLabel
                  control={<Switch checked={sortedRMP} onChange={toggleSort} name="sort" />}
                  label={<p style={{ fontSize: '13px' }}>Sort by Rating</p>}
                />
              </div>
              <div style={{ width: '80%', textAlign: 'center', margin: 'auto' }}>
                <div style={{ color: '#00863f', fontWeight: 700, display: 'inline' }}>{code}</div>{' '}
                {title}
              </div>
              <Tooltip title="Inspired by Sunny and Nitin">
                <InfoIcon sx={{ mt: 0.5 }} />
              </Tooltip>
            </div>
            <div>{displayClassInfo()}</div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.forwardRef(CourseCard);
