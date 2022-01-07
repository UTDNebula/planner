import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Tab,
  Tabs,
  Theme,
  Typography,
} from '@material-ui/core';
import CourseSearchBox from '../../search/CourseSearchBox/CourseSearchBox';
import { Course } from '../../../modules/common/data';
import { DestinationData } from '../../../modules/planner/hooks/selectableCourseDialog';
import DialogCard from './DialogCard';
import { loadCourses } from '../../../modules/common/api/courses';
import useSearch from '../../search/search';
import SearchBar from '../../search/SearchBar';

/**
 * Component properties for a AddCourseDialog.
 */
interface AddCourseDialogProps {
  /**
   * A collection of valid courses to add.
   */
  courses: Course[];

  /**
   * A title for the destination to where courses will be added.
   */
  destination: DestinationData | null;

  /**
   * If true, multiple course selections will be allowed.
   */
  allowMultiple: boolean;

  /**
   * True if the dialog is currently open.
   */
  open: boolean;

  /**
   * A callback triggered when the dialog closes without selection.
   */
  onCancelled: () => void;

  /**
   * A callback notified when course selections are finalized.
   */
  onCoursesSelected: (courseIds: string[], destinationId: string) => void;
}

/**
 * A dialog that allows for the selection of courses.
 *
 * The useSelectableCourseDialog hook should be used to easily interface with
 * this component.
 */
export default function AddCourseDialog({
  courses,
  destination,
  allowMultiple,
  open,
  onCancelled,
  onCoursesSelected,
}: AddCourseDialogProps): JSX.Element {
  const destinationName = destination ? destination.name : '';
  const destinationText = `Add course${allowMultiple ? 's' : ''} to ${destinationName}`;

  const [selectionMap, setSelectionMap] = React.useState<{ [key: string]: boolean }>({});

  const [selectedCount, setSelectedCount] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.currentTarget;
    const newCount = checked ? selectedCount + 1 : selectedCount - 1;
    setSelectedCount(newCount);
    setSelectionMap({
      ...selectionMap,
      [name]: checked,
    });
  };

  const isDone = selectedCount > 0;

  const handleOnClose = () => {
    if (!isDone) {
      onCancelled();
      return;
    }
    // TODO: Fix obvious code smell
    const items = Object.keys(selectionMap);
    onCoursesSelected(items, destination?.destinationId ?? '');
    setSelectedCount(0);
    setSelectionMap({});
  };

  const courseItems = courses.map((course) => {
    const itemLabel = `${course.catalogCode}: ${course.title}`;
    return (
      <FormControlLabel
        key={course.id}
        control={<Checkbox onChange={handleChange} name={course.id} />}
        label={itemLabel}
      />
    );
  });
  // const classes = useStyles();

  const [searchSelections, setSearchSelections] = React.useState<string[]>([]);

  const handleSearchSelection = (courseId: string) => {
    // This appends; course can be removed some other way
    setSearchSelections([...searchSelections, courseId]);
  };

  return (
    <Dialog open={open} onClose={handleOnClose} aria-labelledby={destinationText}>
      <DialogTitle id="addCourseDialogTitle">{destinationText}</DialogTitle>
      <DialogContent>
        <CourseSearchBox onItemSelected={handleSearchSelection} />
        <div>
          <div>Or select one from below:</div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select courses</FormLabel>
            <FormGroup>{courseItems}</FormGroup>
            <FormHelperText>Choose as many as you want.</FormHelperText>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button color="primary" disabled={!isDone} onClick={handleOnClose} autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* Caleb Code */

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export type SimpleTabsProps = {
  courses: Course[];
  selectedCourses: Course[];
  setSelectedCourses: (course: Course[]) => void;
};

/* Refactor this copy-paste Component */
export function SimpleTabs({ courses, selectedCourses, setSelectedCourses }: SimpleTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setValue(newValue);
  };

  const addSelectedCourse = (course: Course) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const removeSelectedCourse = (course: Course) => {
    setSelectedCourses(selectedCourses.filter((elm) => elm.id !== course.id));
  };

  // TODO: Add chips to search
  // TODO: Implement lazy loading
  const chipsList = [];
  const [chips, setChips] = useState(chipsList);
  const { results, updateQuery } = useSearch({ getData: loadCourses, filterBy: 'catalogCode' });

  const handleSearch = (query: string) => {
    updateQuery(query);
  };

  // Run updateQuery on dialog screen load
  React.useEffect(() => {
    updateQuery('');
  }, []);

  return (
    <div className="p-">
      <AppBar position="static">
        <Tabs
          className="bg-blue-800"
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className="grid grid-cols-2">
          <div className="flex flex-col border-2 w-80">
            <SearchBar updateQuery={handleSearch} />
            <div className="flex flex-row">
              <div>Subject</div>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
            </div>
            <div className="flex flex-row">
              <div>Type</div>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
            </div>
            <div className="overflow-scroll h-40">
              {results.map((elm, index) => (
                <DialogCard
                  key={elm.catalogCode}
                  course={elm}
                  setSelectedCourse={addSelectedCourse}
                  type={'Add'}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div> Selected Courses </div>
            {selectedCourses.map((elm, index) => (
              <DialogCard
                key={elm.catalogCode}
                course={elm}
                setSelectedCourse={removeSelectedCourse}
                type={'Remove'}
              />
            ))}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </div>
  );
}

export type AddNewCourseDialogProps = {
  isOpen: boolean;
  enableFocus: (focus: boolean) => void;
  addUserCourses: (couses: Course[]) => void;
};

/* TODO: Clean this up lol */
/** TODO: Add local course validation
 * This means graying out courses that are already selected & not allowing them to be selected
 */
export function AddNewCourseDialog({
  isOpen,
  enableFocus,
  addUserCourses,
}: AddNewCourseDialogProps) {
  // Use this to hold courses user selected
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    const courses = await loadCourses();
    const reduced = courses.slice(0, 50).reduce((acc: { [key: string]: Course }, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
    return reduced;
  };

  const [allCourses, setAllCourses] = React.useState<{ [key: string]: Course }>({});
  React.useEffect(() => {
    fetchCourses()
      .then((courses) => {
        setAllCourses(courses);
      })
      .catch((error) => {
        console.error('Could not fetch courses', error);
      });
  }, []);

  const dialogCourses = Object.values(allCourses);

  const handleOnClose = () => {
    console.log('Closed');
    enableFocus(false);
  };

  const handleAdd = () => {
    addUserCourses(selectedCourses);
    enableFocus(false);
  };

  const handleSearchSelection = () => {
    console.log('Not implemented');
  };

  const isDone = selectedCourses.length > 0;

  const destinationText = 'Select courses';

  return (
    <Dialog
      disableEnforceFocus={true}
      open={isOpen}
      onClose={handleOnClose}
      aria-labelledby={destinationText}
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle className="bg-blue-800 text-white"> Add Courses</DialogTitle>
      <SimpleTabs
        courses={dialogCourses}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button color="primary" disabled={!isDone} onClick={handleAdd} autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
