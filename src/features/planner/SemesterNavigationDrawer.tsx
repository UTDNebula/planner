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