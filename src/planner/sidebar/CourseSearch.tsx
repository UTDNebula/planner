import React from 'react';
import { Course } from '../../store/catalog/types';
import CourseCard from '../../courses/CourseCard';
import {
  List,
  InputBase,
  Paper,
  IconButton,
  makeStyles,
  Theme,
  createStyles,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

interface CourseSearchProps {
  courses: Course[];
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    searchBox: {
      height: 56,
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 8,
    },
  });
});

/**
 * A searchbox and results list.
 */
export default function CourseSearch(props: CourseSearchProps): JSX.Element {
  const [results, setResults] = React.useState<Course[]>([]);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [timeoutCounter, setTimeoutCounter] = React.useState(0);

  const classes = useStyles();

  /**
   * Updates the currently stored search results in state.
   */
  const search = () => {
    setLoading(true);
    const results = props.courses.filter((course: Course) => {
      return (
        course.fullName.includes(query) ||
        course.description.includes(query) ||
        course.subject.includes(query) ||
        course.suffix.includes(query)
      );
    });
    setTimeout(() => {
      console.log('Search complete');
    }, 1000);
    setResults(results);
    setLoading(false);
  };

  /**
   * Triggers a search update.
   *
   * @param e A form event
   */
  const handleQueryUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // TODO: Use timeout for searching
    search();
  };
  const resultBlocks = results.map((course, index) => (
    <CourseCard key={course.id} index={index} course={course} enabled={true} />
  ));
  const loadingIndicator = loading ? (
    <div>
      <Typography variant="subtitle1">Loading</Typography>
    </div>
  ) : (
    <></>
  );
  return (
    <div>
      <Paper elevation={2} className={classes.searchBox}>
        <InputBase
          id="searchQuery"
          placeholder="Search courses"
          value={query}
          onChange={handleQueryUpdate}
          className={classes.input}
        />
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      {loadingIndicator}
      <List>{resultBlocks}</List>
    </div>
  );
}
