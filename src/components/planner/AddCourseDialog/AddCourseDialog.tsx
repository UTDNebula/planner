import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { loadCourses } from '../../../modules/common/api/courses';
import { Course } from '../../../modules/common/data';
import useSearch from '../../search/search';
import SearchBar from '../../search/SearchBar';
import DialogCard from './DialogCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

// TODO: Refactor this copy paste component
/**
 * Tabs that toggle between components
 */
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

/* TODO: Refactor this copy-paste Component */
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

  const { results, updateQuery } = useSearch({
    getData: loadCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
  });

  const handleSearch = (query: string) => {
    updateQuery(query);
  };

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

/**
 * Dialog for users to add new courses into their degree planner
 */
export default function AddCourseDialog({
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
      className="absolute z-20"
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
