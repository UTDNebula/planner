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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {
  Course,
  SemesterCode,
  Grade,
  GPA_MAPPINGS,
  SEMESTER_CODE_MAPPINGS,
} from '../../../../modules/common/data';
import { CourseAttempt } from '../../../../modules/auth/auth-context';

const ROWS_PER_PAGE = [5, 10, 25];

const LETTERS = GPA_MAPPINGS;
const SEMESTERS = { Spring: 3, Summer: 2, Fall: 1 };

//stylehseet
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
  const bee = '' + b[orderBy]; //casting as string to pass type validation checks
  const ay = '' + a[orderBy];

  //Compares the values based on GPA value instead of a by-character basis
  if (orderBy === 'grade') {
    if (LETTERS[bee] > LETTERS[ay]) {
      return -1;
    }
    if (LETTERS[bee] < LETTERS[ay]) {
      return 1;
    }
    //Special case for A+ since the GPA is 4.0 but is sorted under A (which is also 4.0)
    if (bee === 'A+' && ay !== 'A+') {
      return -1;
    }
    if (bee !== 'A+' && ay === 'A+') {
      return 1;
    }
  }
  //First compares the year and then compares the seasons
  //Semester format is [YEAR][SPACE][SEASON]
  if (orderBy === 'semester') {
    if (bee.split(' ')[0] < ay.split(' ')[0]) {
      return -1;
    }
    if (bee.split(' ')[0] > ay.split(' ')[0]) {
      return 1;
    }
    if (SEMESTERS[bee.split(' ')[1]] < SEMESTERS[ay.split(' ')[1]]) {
      return -1;
    }
    if (SEMESTERS[bee.split(' ')[1]] > SEMESTERS[ay.split(' ')[1]]) {
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
  if (bee < ay) {
    return -1;
  }
  if (bee > ay) {
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
 * Header of the categories
 * disablePadding: used to determine whether to add padding or not in css
 * id: used in the orderBy typing so additional parameters here must be accounted for in orderBy
 * label: used to determine what text to display when rendering
 * numeric: whether the column uses numbers as the data format
 */
interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

//list of implemented columns
const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Course Name' },
  { id: 'semester', numeric: true, disablePadding: false, label: 'Semester' },
  { id: 'grade', numeric: true, disablePadding: false, label: 'Grade' },
];

/**
 * Tools in the header of the table.
 * classes: CSS stylesheet for the tools
 * numSelected: the number of selected rows in the table
 * onRequestSort: event handler that checks when the user wants to sort by a category
 * onSelectAllClick: in case the user wants to select all the rows (UNUSED)
 * order: the order the rows are currently in ('asc' | 'desc')
 * orderBy: the category in which the rows are sorted from
 * rowCount: the number of rows
 */
interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

//implemented tablehead
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

//stylesheet
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
 * Allows adding and deleting courses
 * numSelected: the number of rows selected
 * data: the array of CourseAttempt
 * selectedState: the list of course names that have been selected
 * update(CourseAttempt[]): updates the rows
 * updateNum(string[]): updates the number selected
 * updateSelectedState(string[]): updates the list of courses selected
 */
interface EnhancedTableToolbarProps {
  numSelected: number;
  data: CourseAttempt[];
  selectedState: string[];
  update(courses: CourseAttempt[]): any;
  updateNum(courses: string[]): any;
  updateSelectedState(courses: string[]): any;
}

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns
 * @param array - an array of any type where the indices are rendered as separate options
 * returns the rendered list of MenuItems
 */
function returnOptions(array) {
  const options = [];
  for (let i = 0; i < array.length; i++) {
    options.push(<MenuItem value={array[i]}>{array[i]}</MenuItem>);
  }
  return options;
}

/**
 * Generates the year up to the next 5 years as an array of integers
 * returns an integer array
 */
function returnYears() {
  const currentYear = new Date().getFullYear() + 5;
  const max = currentYear - 1970;
  const years = Array.from(Array(max).keys());
  for (let i = 0; i < years.length; i++) {
    years[i] = years[i] + 1970;
  }
  return years.reverse();
}

//The implemented toolbar
const EnhancedTableToolbar = ({
  numSelected,
  data,
  update,
  updateNum,
  selectedState,
  updateSelectedState,
}: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const [adding, setAdding] = React.useState(false);
  const [courseName, setName] = React.useState('PLACEHOLDER');
  const [year, setYear] = React.useState(2020);
  const [season, setSeason] = React.useState('Spring');
  const [grade, setGrade] = React.useState('A+');
  const temp = data.slice();

  //Deletes the selected items by iterating and splicing when the items are found
  const deleteStuff = () => {
    for (let i = 0; i < selectedState.length; i++) {
      for (let j = 0; j < temp.length; j++) {
        if (temp[j].course.catalogCode === selectedState[i]) {
          temp.splice(j, 1);
        }
      }
    }
    updateSelectedState([]);
    update(temp);
    updateNum([]);
  };

  //If the user isn't in the adding mode then enable it
  //If the user is in the adding mode then push the values to the rows and data array
  const addStuff = () => {
    if (!adding) {
      setAdding(true);
      return;
    }

    temp.push({
      course: {
        id: 'test',
        title: 'test',
        catalogCode: courseName,
        description: 'test',
        creditHours: 0,
      },
      semester: year + ' ' + season,
      grade: grade as Grade,
    });
    update(temp);
    setAdding(false);
  };

  //when the user clicks on or off the Select tag then it pushes the value to a state
  //Sorts depending on the name of the Select tag and sets the state accordingly
  const handleChange = (event: React.ChangeEvent<{ value: string | number; name: string }>) => {
    if (event.target.name === 'Year') {
      setYear(event.target.value as number);
    }
    if (event.target.name === 'Season') {
      setSeason(event.target.value as string);
    }
    if (event.target.name === 'Grade') {
      setGrade(event.target.value as string);
    }
    if (event.target.name === 'Course') {
      setName(event.target.value as string);
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selectedState.length > 0,
      })}
    >
      {(() => {
        if (adding) {
          return (
            <div className={classes.wrapper}>
              <TextField
                className={classes.course}
                id="course"
                type="course"
                name="Course"
                placeholder="Enter Course Name"
                onChange={handleChange}
              ></TextField>
              <FormControl className={classes.wider}>
                <InputLabel shrink={true} id="year">
                  Year
                </InputLabel>
                <Select labelId="year" id="year" value={year} onChange={handleChange} name={'Year'}>
                  {returnOptions(returnYears())}
                </Select>
              </FormControl>
              <FormControl className={classes.wider}>
                <InputLabel shrink={true} id="season">
                  Season
                </InputLabel>
                <Select
                  labelId="season"
                  id="season"
                  value={season}
                  onChange={handleChange}
                  name={'Season'}
                >
                  {returnOptions(Object.keys(SEMESTERS))}
                </Select>
              </FormControl>
              <FormControl className={classes.wider}>
                <InputLabel shrink={true} id="grade">
                  Grade
                </InputLabel>
                <Select
                  labelId="grade"
                  id="grade"
                  value={grade}
                  onChange={handleChange}
                  name={'Grade'}
                >
                  {returnOptions(Object.keys(LETTERS))}
                </Select>
              </FormControl>
            </div>
          );
        } else if (selectedState.length > 0) {
          return (
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selectedState.length} selected
            </Typography>
          );
        } else {
          return (
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
              Course History
            </Typography>
          );
        }
      })()}
      {(() => {
        if (adding) {
          return (
            <Tooltip title="Done">
              <IconButton aria-label="done" onClick={addStuff}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          );
        } else if (selectedState.length > 0) {
          return (
            <Tooltip title="Delete Course">
              <IconButton aria-label="delete" onClick={deleteStuff}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Add Course">
              <IconButton aria-label="add" onClick={addStuff}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          );
        }
      })()}
    </Toolbar>
  );
};

//Colors the grade according to its GPA value
//Calculates based on a rational function with a constant
function colorMeBlue(grade) {
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
export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<OrderBy>('semester');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<CourseAttempt[]>([]);

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

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

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
                  const isItemSelected = isSelected(row.course.catalogCode);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.course.catalogCode)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.course.catalogCode}
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
                      <TableCell align="left" style={{ color: colorMeBlue(row.grade) }}>
                        {row.grade}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
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
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
