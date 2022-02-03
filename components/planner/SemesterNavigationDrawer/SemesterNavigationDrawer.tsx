import { Theme, Drawer, List, ListItemText, Toolbar, Typography, MenuItem } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

/**
 * A containing type for a displayed semester item.
 */
interface NavDrawerSemester {
  code: string;
  title: string;
}

/**
 * Component properties for a SemesterNavigationDrawer.
 */
interface SemesterNavigationDrawerProps {
  /**
   * The navigation items displayed in this drawer.
   */
  semesters: NavDrawerSemester[];

  /**
   * The ID of the currently selected navigation item.
   */
  focusedSemester: string;

  /**
   * A callback notified on semester navigation item selection.
   */
  onSemesterSelection: (semesterCode: string) => void;
}

/**
 * Create styles for a SemesterNavigationDrawer.
 *
 * TODO: Make responsive.
 *
 * @param drawerWidth The horizontal width of the drawer when rendered.
 */
const useStyles = (drawerWidth = 240) =>
  makeStyles((theme: Theme) =>
    createStyles({
      root: {
        height: '100%',

        width: 240,
        flexShrink: 0,
      },
      drawerContainer: {
        overflow: 'auto',
      },
      drawerPaper: {
        width: drawerWidth,
      },
      drawerTitle: {
        padding: theme.spacing(2),
      },
    }),
  )();

/**
 * A navigation drawer that exposes shortcuts for quickly jumping to semesters.
 * Note: Unused component
 * TODO: Either use or remove this component for planner v1
 */
export default function SemesterNavigationDrawer(
  props: SemesterNavigationDrawerProps,
): JSX.Element {
  const { semesters, onSemesterSelection, focusedSemester } = props;

  const navItems = semesters.map(({ code, title }) => {
    return (
      <MenuItem
        key={code}
        onClick={() => {
          onSemesterSelection(code);
        }}
        selected={focusedSemester === code}
      >
        <ListItemText primary={title} />
      </MenuItem>
    );
  });

  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Toolbar />
      <Typography className={classes.drawerTitle} variant="h6">
        Semesters
      </Typography>
      <List className={classes.drawerContainer}>{navItems}</List>
    </Drawer>
  );
}

/**
 * A custom hook to enapsulate SemesterNavigationDrawer behavior.
 *
 * @param semesters The semester information displayed on the sidebar
 */
export function useSemesterNavigation(semesters: NavDrawerSemester[]) {
  const [focusedSemester, setFocusedSemester] = React.useState(semesters[0].code);

  const scrollToSemseter = (semesterCode: string) => {
    setFocusedSemester(semesterCode);
  };

  const onSemesterSelection = (semesterCode: string) => {
    scrollToSemseter(semesterCode);
  };

  return {
    semesters,
    focusedSemester,
    onSemesterSelection,
    scrollToSemseter,
  };
}
