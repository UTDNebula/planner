import {
  makeStyles, Theme, createStyles, Drawer, List, ListItem, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import React from 'react';

interface NavDrawerSemester {
  code: string;
  title: string;
}

interface SemesterNavigationDrawerProps {
  semesters: NavDrawerSemester[];
  onSelection: (semesterCode: string) => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    // width: 240,
  },
  drawerContainer: {
    overflow: 'auto',
  },
}));


export default function SemesterNavigationDrawer(props: SemesterNavigationDrawerProps) {
  const { semesters, onSelection } = props;

  const navItems = semesters.map(({ code, title }) => {
    return (
      <ListItem key={code} onClick={() => { onSelection(code) }} button>
        <ListItemText primary={title} />
      </ListItem>
    );
  });

  const classes = useStyles();

  return (
    <Drawer className={classes.root} variant="permanent">
      <Toolbar />
      <Typography variant="caption">Semesters</Typography>
      <List className={classes.drawerContainer}>
        {navItems}
      </List>
    </Drawer>
  );
}