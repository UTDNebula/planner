import {
  createStyles,
  makeStyles,
  Theme,
  Drawer,
  List,
  ListItemText,
  Toolbar,
  Typography,
  MenuItem,
} from '@material-ui/core';
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
   * The index of the currently selected navigation item.
   */
  selected: number;

  /**
   * A callback notified on semester navigation item selection.
   */
  onSelection: (semesterCode: string) => void;
}

/**
 * Create styles for a SemesterNavigationDrawer.
 *
 * TODO: Make responsive.
 *
 * @param drawerWidth The horizontal width of the drawer when rendered.
 */
const useStyles = (drawerWidth: number = 240) => (
  makeStyles((theme: Theme) => createStyles({
    root: {
      width: 240,
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
  }))
)();


/**
 * A navigation drawer that exposes shortcuts for quickly jumping to semesters.
 */
export default function SemesterNavigationDrawer(props: SemesterNavigationDrawerProps) {
  const { semesters, onSelection, selected } = props;

  const navItems = semesters.map(({ code, title }, index) => {
    return (
      <MenuItem key={code} onClick={() => { onSelection(code) }} selected={selected === index} button>
        <ListItemText primary={title} />
      </MenuItem>
    );
  });

  const classes = useStyles();

  return (
    <Drawer className={classes.root} variant="permanent" classes={{
      paper: classes.drawerPaper,
    }}>
      <Toolbar />
      <Typography className={classes.drawerTitle} variant="h6">Semesters</Typography>
      <List className={classes.drawerContainer}>
        {navItems}
      </List>
    </Drawer>
  );
}