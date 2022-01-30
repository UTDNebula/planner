import React from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Grade, GPA_MAPPINGS } from '../../../../modules/common/data';
import { CourseAttempt } from '../../../../modules/auth/auth-context';
import { useSelector, useDispatch } from 'react-redux';
import { updateCourseAudit } from '../../../../modules/redux/userDataSlice';

const ROWS_PER_PAGE = [5, 10, 25];
const NOT_DENSE_PADDING = 53;
const DENSE_PADDING = 33;
const YEAR_RANGE = 10;
const CURRENT_YEAR = new Date().getFullYear();

const LETTERS = GPA_MAPPINGS;
const SEMESTERS = { Spring: 1, Summer: 2, Fall: 3 };

/**
 * Component styles for EnchancedTable
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      width: '100%',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

/**
 * Determines whether b is greater or less than a and returns -1, 0, or 1
 * @param a - The first CourseAttempt
 * @param b - The second CourseAttempt
 * returns an integer which indicates whether b is greater or lesser than a
 */
type OrderBy = 'grade' | 'semester' | 'name';

function descendingComparator<CourseAttempt>(a: CourseAttempt, b: CourseAttempt, orderBy: OrderBy) {
  const stringB = b[orderBy] as string;
  const stringA = a[orderBy] as string;

  //Compares the values based on GPA value instead of a by-character basis
  if (orderBy === 'grade') {
    if (LETTERS[stringB] > LETTERS[stringA]) {
      return -1;
    }
    if (LETTERS[stringB] < LETTERS[stringA]) {
      return 1;
    }
    //Special case for A+ since the GPA is 4.0 but is sorted under A (which is also 4.0)
    if (stringB === 'A+' && stringA !== 'A+') {
      return -1;
    }
    if (stringB !== 'A+' && stringA === 'A+') {
      return 1;
    }
  }
  //First compares the year and then compares the seasons
  //Semester format is [YEAR] [SEASON]
  if (orderBy === 'semester') {
    if (stringB.split(' ')[0] < stringA.split(' ')[0]) {
      return -1;
    }
    if (stringB.split(' ')[0] > stringA.split(' ')[0]) {
      return 1;
    }
    if (SEMESTERS[stringB.split(' ')[1]] < SEMESTERS[stringA.split(' ')[1]]) {
      return -1;
    }
    if (SEMESTERS[stringB.split(' ')[1]] > SEMESTERS[stringA.split(' ')[1]]) {
      return 1;
    }
  }

  //If the orderBy is for the name then the directory of the name is different than the other two
  if (orderBy === 'name') {
    if (b['course'].catalogCode < a['course'].catalogCode) {
      return -1;
    }
    if (b['course'].catalogCode > a['course'].catalogCode) {
      return 1;
    }
  }

  //A catch case when the table is expanded
  if (stringB < stringA) {
    return -1;
  }
  if (stringB > stringA) {
    return 1;
  }
  return 0;
}

/**
 * Accounts for whether the user wishes to sort by ascending or descending
 * If descending then do nothing but ascending flip the returned values from the comparator
 * @param order - the type Order that determines whether it is descending or not
 * @param orderBy - the category in which the user wishes to sort by
 * returns the corrected value based on the preferred order
 */
type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: OrderBy,
): (a: CourseAttempt, b: CourseAttempt) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Uses the descendingComparator and getComparator to actually sort the Array of type T
 * Type T in this refers to CourseAttempt which contains the data the user will input and store
 *
 * @param array - Array of CourseAttempt
 * @param comparator - comparator which must return a number and accounts for the user order
 * returns the corrected order in which the two indices must be sorted
 */
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

/**
 * Header of the categories found within the rows and are displayed as the column headers.
 */
interface HeadCell {
  /*
   * Used to determine the size of row padding with the DENSE_PADDING and NOT_DENSE_PADDING
   */
  disablePadding: boolean;
  /*
   * Tag to identify which column the rows are being sorted by.
   */
  id: OrderBy;
  /*
   * The name that will be displayed in the column header.
   */
  label: string;
  /*
   * Whether the values are numbers. Only changes the alignment of the text.
   */
  numeric: boolean;
}

/**
 * Array of implemented HeadCells used to categorize the user's Course History
 */
const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Course Name' },
  { id: 'semester', numeric: true, disablePadding: false, label: 'Semester' },
  { id: 'grade', numeric: true, disablePadding: false, label: 'Grade' },
];

/**
 * Tools in the header of the table used for selections and sorting.
 */
interface EnhancedTableProps {
  /*
   * Styling that will be used for this component.
   */
  classes: ReturnType<typeof useStyles>;
  /*
   * The number of selected rows in the table.
   */
  numSelected: number;
  /*
   * Event handler that checks when the user wants to sort by a category.
   */
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  /*
   * Event handler for when the user wants to select all the rows.
   */
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /*
   * String that indicates whether the order is ascending or descending.
   */
  order: Order;
  /*
   * The category in which the rows are being sorted by.
   */
  orderBy: string;
  /*
   * The total number of rows in the table.
   */
  rowCount: number;
}

/**
 * Implemented EnchancedTableHead which allows selection of table rows and sorting
 */
function EnhancedTableHead({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <div className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </div>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/**
 * Component styles for EnchancedTableToolbarProps
 */
const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    wrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      width: '100%',
    },
    wider: {
      width: '10%',
      marginLeft: '-24px',
    },
    course: {
      paddingTop: '22px',
      width: '25%',
    },
  }),
);

/**
 * Component properties for EnchancedTableToolbar
 */
interface EnhancedTableToolbarProps {
  /*
   * The number of rows selected.
   */
  numSelected: number;
  /*
   * List of all the CourseAttempts in the table at the moment.
   */
  data: CourseAttempt[];
  /*
   * The full name of the selected rows. Format is [NAME] [DATE] [GRADE]
   */
  selectedState: string[];
  /*
   * Function used to update the list of CourseAttempts in the table.
   */
  update: (courses: CourseAttempt[]) => void;
  /*
   * Function used to update the number of selected CourseAttempts.
   */
  updateNum: (courses: string[]) => void;
  /*
   * Function used to update the list of selected CourseAttempts.
   */
  updateSelectedState: (courses: string[]) => void;
}

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[] | number[]) {
  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

/**
 * Generates the year up to the next 5 years as an array of integers
 *
 * @return An integer array from 1970 to the current year.
 */
function returnYears() {
  return Array.from(Array(YEAR_RANGE).keys()).map((value) => CURRENT_YEAR - value);
}

/**
 * Implemented EnchancedTableToolbar which mainly provides adding and deleting courses.
 * Also shows the number of selected rows if the selected count is more than 0.
 */
const EnhancedTableToolbar = ({
  numSelected,
  data,
  update,
  updateNum,
  selectedState,
  updateSelectedState,
}: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const [newCourse, setNewCourse] = React.useState({
    courseName: '',
    year: CURRENT_YEAR,
    season: 'Spring',
    grade: 'A+' as Grade,
  });
  const [error, setError] = React.useState({
    isError: false,
    message: '',
  });
  const copiedData = data.slice();
  const dispatch = useDispatch();

  //When the user clicks on or off the Select tag then it pushes the value to a state
  //Sorts depending on the name of the Select tag and sets the state accordingly
  const handleChange = (event: React.ChangeEvent<{ value: string | number; name: string }>) => {
    setNewCourse((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  //The header which contains the fields to add a new course to EnchancedTable.
  const addingComponent = (
    <div className={classes.wrapper}>
      {
        // Textfield for the course's name
      }
      <TextField
        className={classes.course}
        id="course"
        type="course"
        name="courseName"
        value={newCourse.courseName}
        placeholder="Enter Course Name"
        onChange={handleChange}
        error={error.isError}
        helperText={error.isError ? error.message : ''}
      />
      {
        //Dropdown menu for the year the course was taken.
        //Only provides the past YEAR_RANGE years.
      }
      <FormControl className={classes.wider}>
        <InputLabel shrink={true} id="year">
          Year
        </InputLabel>
        <Select
          labelId="year"
          id="year"
          value={newCourse.year}
          onChange={handleChange}
          name={'year'}
        >
          {returnMenuItems(returnYears())}
        </Select>
      </FormControl>
      {
        //Dropdown menu for the Spring, Summer, and Fall seasons.
      }
      <FormControl className={classes.wider}>
        <InputLabel shrink={true} id="season">
          Season
        </InputLabel>
        <Select
          labelId="season"
          id="season"
          value={newCourse.season}
          onChange={handleChange}
          name="season"
        >
          {returnMenuItems(Object.keys(SEMESTERS))}
        </Select>
      </FormControl>
      {
        //Dropdown for the possible grades. Data pulled from GPA_MAPPINGS and Grade
      }
      <FormControl className={classes.wider}>
        <InputLabel shrink={true} id="grade">
          Grade
        </InputLabel>
        <Select
          labelId="grade"
          id="grade"
          value={newCourse.grade}
          onChange={handleChange}
          name="grade"
        >
          {returnMenuItems(Object.keys(LETTERS))}
        </Select>
      </FormControl>
    </div>
  );

  const numSelectedComponent = (
    <Typography className={classes.wrapper} color="inherit" variant="subtitle1" component="div">
      {selectedState.length} selected
    </Typography>
  );

  //Deletes the selected items by iterating and splicing when the items are found
  //Stored selected data is in format: [NAME] [SEMESTER] [GRADE]
  const deleteSelectedCourses = () => {
    for (let i = 0; i < selectedState.length; i++) {
      for (let j = 0; j < copiedData.length; j++) {
        const courseName = copiedData[j].course.catalogCode;
        const courseSem = copiedData[j].semester;
        const courseGrade = copiedData[j].grade;
        if (courseName + ' ' + courseSem + ' ' + courseGrade === selectedState[i]) {
          copiedData.splice(j, 1);
        }
      }
    }
    updateSelectedState([]);
    update(copiedData);
    updateNum([]);
    dispatch(updateCourseAudit(copiedData));
  };

  //If the user is in the adding mode then push the values to the rows and data array
  const addCourse = () => {
    //Checks to see if the course has a name
    if (newCourse.courseName === '') {
      setError({
        isError: true,
        message: 'Enter a course name!',
      });
      return;
    }

    //Checks to see if the course already exists in the semester specified
    const newFullName = newCourse.courseName + ' ' + newCourse.year + ' ' + newCourse.season;
    if (data.some((index) => index.course.catalogCode + ' ' + index.semester === newFullName)) {
      setError({
        isError: true,
        message: 'This course already exists in that semester!',
      });
      return;
    }

    //Pushes the new couse to the cloned array and updates the data state with the cloned array.
    copiedData.push({
      course: {
        id: 'test',
        title: 'test',
        catalogCode: newCourse.courseName,
        description: 'test',
        creditHours: 0,
      },
      semester: newCourse.year + ' ' + newCourse.season,
      grade: newCourse.grade as Grade,
    });

    update(copiedData);
    setError({
      isError: false,
      message: '',
    });
    setNewCourse((prevState) => ({
      ...prevState,
      courseName: '',
    }));
    dispatch(updateCourseAudit(copiedData));
  };

  //Button which pushes the values in the respective fields to the data in EnchancedTable.
  const addButtonComponent = (
    <Tooltip title="Add Course">
      <IconButton aria-label="add" onClick={addCourse}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  );

  //Button which deletes the selected courses in selectedState from the data in EnchancedTable.
  const deleteButtonComponent = (
    <Tooltip title="Delete Course">
      <IconButton aria-label="delete" onClick={deleteSelectedCourses}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );

  /*
   * Returns 2 parts:
   *     The Header - If the user is not adding a course it displays the number of selected courses.
   *                  If the user is adding a course then the adding course ui is shown instead.
   *     The Button - Adding and Done do the same action just in different components.
   *                  Delete deletes all the courses that are selected.
   */
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selectedState.length > 0,
      })}
    >
      {(() => {
        if (selectedState.length > 0) {
          return numSelectedComponent;
        } else {
          return addingComponent;
        }
      })()}
      {(() => {
        if (selectedState.length > 0) {
          return deleteButtonComponent;
        } else {
          return addButtonComponent;
        }
      })()}
    </Toolbar>
  );
};

/*
 * Calculates a color based on the grade given.
 *
 * @param grade The grade which was given
 * @return A string which serves as the color styling for the specific grade.
 */
function colorGrade(grade: Grade) {
  const index = LETTERS[grade];
  if (index === -1) {
    return 'rgb(0,0,0)';
  }
  const factor = 2;
  return (
    'rgb(' +
    Math.round((255 * factor) / (index + factor)) +
    ',' +
    Math.round(255 - (255 * factor) / (index + factor)) +
    ',64)'
  );
}

/**
 * The table which the user directly interacts with.
 * Uses EnhancedTableHead and EnchancedTableToolbar to allow more functionality.
 * Also uses userStyles as the stylesheet
 */
export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<OrderBy>('semester');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const initialState =
    useSelector((state: { userData: { courses: CourseAttempt[] } }) => state.userData.courses) ??
    [];
  const [rows, setRows] = React.useState<CourseAttempt[]>(initialState);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    let orderType: OrderBy;
    if (property === 'name') {
      orderType = 'name';
    } else if (property === 'semester') {
      orderType = 'semester';
    } else if (property === 'grade') {
      orderType = 'grade';
    }
    setOrderBy(orderType);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.course.catalogCode);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, course: CourseAttempt) => {
    const fullCourse = course.course.catalogCode + ' ' + course['semester'] + ' ' + course['grade'];
    const selectedIndex = selected.indexOf(fullCourse);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, fullCourse);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (course: CourseAttempt) =>
    selected.indexOf(course.course.catalogCode + ' ' + course.semester + ' ' + course.grade) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          data={rows}
          selectedState={selected}
          updateSelectedState={setSelected}
          update={setRows}
          updateNum={setSelected}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.course.catalogCode + ' ' + row.semester + ' ' + row.grade}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.course.catalogCode}
                      </TableCell>
                      <TableCell align="left">{row.semester}</TableCell>
                      <TableCell align="left" style={{ color: colorGrade(row.grade) }}>
                        {row.grade}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{ height: (dense ? DENSE_PADDING : NOT_DENSE_PADDING) * emptyRows }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onPageChange={() => console.log('Add code here')}
        />
      </Paper>
    </div>
  );
}
