import React, { useState } from 'react';
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
import { Course, SemesterCode, GPA_MAPPINGS } from '../../../../modules/common/data';

let selectedState = [];
let tempData = [];

const letters = GPA_MAPPINGS;
const semesters = { Spring: 4, Summer: 3, Fall: 2, Winter: 1 };

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (orderBy === 'grade') {
    if (letters[b[orderBy]] > letters[a[orderBy]]) {
      return -1;
    }
    if (letters[b[orderBy]] < letters[a[orderBy]]) {
      return 1;
    }
  }
  if (orderBy === 'semester') {
    if (b[orderBy].split(' ')[0] < a[orderBy].split(' ')[0]) {
      return -1;
    }
    if (b[orderBy].split(' ')[0] > a[orderBy].split(' ')[0]) {
      return 1;
    }
    if (semesters[b[orderBy].split(' ')[1]] < semesters[a[orderBy].split(' ')[1]]) {
      return -1;
    }
    if (semesters[b[orderBy].split(' ')[1]] > semesters[a[orderBy].split(' ')[1]]) {
      return 1;
    }
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'course', numeric: false, disablePadding: true, label: 'Course Name' },
  { id: 'semester', numeric: true, disablePadding: false, label: 'Semester' },
  { id: 'grade', numeric: true, disablePadding: false, label: 'Grade' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
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
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

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
    title: {
      flex: '1 1 100%',
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
      width: '10vw',
    },
    course: {
      paddingTop: '22px',
      width: '20vw',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  data: Course[];
  update(): any;
  updateNum(): any;
}

function returnOptions(array) {
  const options = [];
  for (let i = 0; i < array.length; i++) {
    options.push(<MenuItem value={array[i]}>{array[i]}</MenuItem>);
  }
  return options;
}

function returnYears() {
  const currentYear = new Date().getFullYear() + 5;
  const max = currentYear - 1970;
  const years = Array.from(Array(max).keys());
  for (let i = 0; i < years.length; i++) {
    years[i] = years[i] + 1970;
  }
  return years.reverse();
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const { data } = props;
  const { update } = props;
  const { updateNum } = props;
  const [adding, setAdding] = React.useState(false);
  const [courseName, setName] = React.useState('PLACEHOLDER');
  const [year, setYear] = React.useState(2020);
  const [season, setSeason] = React.useState('Spring');
  const [grade, setGrade] = React.useState('A+');
  const temp = data.slice();

  const deleteStuff = () => {
    for (let i = 0; i < selectedState.length; i++) {
      for (let j = 0; j < temp.length; j++) {
        if (temp[j].course === selectedState[i]) {
          temp.splice(j, 1);
        }
      }
    }
    selectedState = [];
    update(temp);
    updateNum(selectedState);
  };

  const addStuff = () => {
    if (!adding) {
      setAdding(true);
      return;
    }
    temp.push({ course: courseName, semester: year + ' ' + season, grade: grade });
    update(temp);
    setAdding(false);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.name === 'Year') {
      setYear(event.target.value as string);
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
                  {returnOptions(Object.keys(semesters))}
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
                  {returnOptions(Object.keys(letters))}
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
      minWidth: 750,
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

let denseState;
export function toggleDense(compactState) {
  denseState = compactState;
}

export function loadData(courseList) {
  tempData = courseList;
}

function colorMeBlue(grade) {
  const index = letters[grade];
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
  const [orderBy, setOrderBy] = React.useState<keyof Data>('semester');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<Course>(tempData);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
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
    selectedState = newSelected;
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
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
          update={setRows}
          updateNum={setSelected}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={denseState ? 'small' : 'medium'}
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
                  const isItemSelected = isSelected(row.course);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.course)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.course}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.course}
                      </TableCell>
                      <TableCell align="left">{row.semester}</TableCell>
                      <TableCell align="left" style={{ color: colorMeBlue(row.grade) }}>
                        {row.grade}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (denseState ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
