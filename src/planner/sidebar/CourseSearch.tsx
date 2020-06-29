import React from 'react';
import { Course } from '../../store/catalog/types';
import CourseCard from '../../courses/CourseCard';
import { List, TextField, Paper } from '@material-ui/core';

interface CourseSearchProps {
  courses: Course[];
}

interface CourseSearchState {
  results: Course[];
  query: string;
}

/**
 * A searchbox and results list.
 */
export default class CourseSearch extends React.Component<CourseSearchProps, CourseSearchState> {
  constructor(props: CourseSearchProps) {
    super(props);
    this.state = {
      results: [],
      query: '',
    };
  }

  /**
   * Updates the currently stored search results in state.
   */
  private search = () => {
    const results = this.props.courses;
    this.setState({
      ...this.state,
      results,
    });
  };

  /**
   * Triggers a search update.
   *
   * @param e A form event
   */
  private handleQueryUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        ...this.state,
        query: e.target.value,
      },
      this.search,
    );
  };

  public render(): React.ReactNode {
    const results = this.state.results.map((course, index) => (
      <CourseCard key={course.id} index={index} course={course} enabled={true} />
    ));
    return (
      <div>
        <Paper elevation={2}>
          <TextField
            id="searchQuery"
            label="Search for a course"
            value={this.state.query}
            onChange={this.handleQueryUpdate}
          />
        </Paper>
        <List>{results}</List>
      </div>
    );
  }
}
