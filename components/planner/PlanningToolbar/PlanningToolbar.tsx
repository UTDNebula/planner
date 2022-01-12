import {
  AppBar,
  Tabs,
  Tab,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from '@material-ui/core';
import React from 'react';
import MenuIcon from '@material-ui/icons/ArrowBack';
import ProfileIcon from '../../common/toolbar/ProfileIcon';
import { useAuthContext } from '../../../modules/auth/auth-context';
import { useRouter } from 'next/router';
import styles from './PlanningToolbar.module.css';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TABS = ['Overview', 'Plan', 'Requirements', 'History'] as const;

export type SectionType = typeof TABS[number];

const useStyles = () => {
  return makeStyles((theme: Theme) => {
    return createStyles({
      root: {
        zIndex: 10,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
    });
  })();
};

/**
 * Component properties for a Planning Toolbar.
 */
interface PlanningToolbarProps {
  /**
   * The currently active tab index.
   */
  sectionIndex: number;

  planTitle: string;

  shouldShowTabs: boolean;

  onTabChange: (newIndex: number) => void;

  /**
   * A callback triggered when the user wants to export the currently loaded plan.
   */
  onExportPlan?: () => void;

  /**
   * A callback triggered when the user wants to import a plan into a planner view.
   *
   * @param event The React form event called when the selected plan is changed.
   */
  onImportPlan?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A toolbar used for planning mode.
 */
export default function PlanningToolbar({
  sectionIndex,
  planTitle,
  shouldShowTabs: showTabs,
  onTabChange,
  onImportPlan = () => undefined,
  onExportPlan = () => undefined,
}: PlanningToolbarProps) {
  const { signOut } = useAuthContext();

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/signIn');
  };

  const handleSignOut = () => {
    signOut();
  };

  const classes = useStyles();

  return (
    <AppBar position="relative" className={classes.root}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => router.back()}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {planTitle}
        </Typography>
        <Button
          color="inherit"
          onClick={() => {
            onExportPlan();
          }}
        >
          Save plan
        </Button>
        <input
          id="planUpload"
          className={styles.visuallyHidden}
          type="file"
          accept="application/json"
          onChange={onImportPlan}
        />
        <label htmlFor="planUpload">
          {/* This must render as a span for the input to function */}
          <Button color="inherit" component="span">
            Import plan
          </Button>
        </label>
        {/* <ProfileIcon onSignIn={handleSignIn} onSignOut={handleSignOut} /> */}
      </Toolbar>
      {showTabs && (
        <Tabs value={sectionIndex} onChange={handleTabChange} aria-label="Degree plan sections">
          {TABS.map((tab, index) => {
            return <Tab key={tab + '-' + index} label={tab} {...a11yProps(index)} />;
          })}
        </Tabs>
      )}
    </AppBar>
  );
}

export function usePlanningToolbar(initialSection = 0, initialTitle = 'Your plan') {
  const [section, setSection] = React.useState(initialSection);
  const [title, setTitle] = React.useState(initialTitle);
  const [shouldShowTabs, setShouldShowTabs] = React.useState(true);

  const hideTabs = () => {
    setShouldShowTabs(false);
  };

  const showTabs = () => {
    setShouldShowTabs(true);
  };

  return {
    title,
    setTitle,
    section,
    setSection,
    showTabs,
    hideTabs,
    shouldShowTabs,
  };
}
