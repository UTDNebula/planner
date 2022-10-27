import MenuIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Button, IconButton, Theme, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { useAuthContext } from '../../../modules/auth/auth-context';
import SettingsDialog from './PlannerSettings';
import styles from './PlanningToolbar.module.css';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TABS = ['Plan'] as const;

export type SectionType = typeof TABS[number];

const useStyles = () => {
  return makeStyles()((theme: Theme) => {
    return {
      root: {
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
    };
  })();
};

/**
 * Component properties for a Planning Toolbar.
 */
interface PlanningToolbarProps {
  planId: string;
  /**
   * The currently active tab index.
   */
  sectionIndex: number;

  planTitle: string;

  setPlanTitle: (title: string) => void;

  shouldShowTabs: boolean;

  onTabChange: (newIndex: number) => void;

  /**
   * A callback triggered when the user wants to export the currently loaded plan.
   */
  onExportPlan?: () => void;

  /**
   * A callback triggered when the user wants to validate the currently loaded plan.
   */
  onValidate?: () => void;

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
  planId,
  sectionIndex,
  planTitle,
  setPlanTitle,
  shouldShowTabs: showTabs,
  onTabChange,
  onImportPlan = () => undefined,
  onExportPlan = () => undefined,
  onValidate = () => undefined,
}: PlanningToolbarProps) {
  const { signOut } = useAuthContext();

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/Login');
  };

  const handleSignOut = () => {
    signOut();
  };

  const { classes } = useStyles();

  const [dialog, setDialog] = React.useState(false);
  const handleSettings = () => {
    setDialog(!dialog);
  };

  return (
    <AppBar position="relative" className={classes.root}>
      <Toolbar className="flex">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => router.push('/app')}
          size="large"
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
          Export plan
        </Button>
        <Button color="inherit" onClick={onValidate}>
          Validate plan
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
        <IconButton onClick={handleSettings} className="" size="large">
          <SettingsIcon color="inherit" className="text-white" />
        </IconButton>
        {/* <ProfileIcon onSignIn={handleSignIn} onSignOut={handleSignOut} /> */}
      </Toolbar>
      <SettingsDialog
        planId={planId}
        isOpen={dialog}
        setOpen={setDialog}
        updatePlanTitle={setPlanTitle}
      />
      {/* {showTabs && (
        <Tabs
          className="flex"
          value={sectionIndex}
          onChange={handleTabChange}
          aria-label="Degree plan sections"
        >
          {TABS.map((tab, index) => {
            return <Tab key={tab + '-' + index} label={tab} {...a11yProps(index)} />;
          })}
        </Tabs>
      )} */}
    </AppBar>
  );
}

export function usePlanningToolbar(initialSection = 0) {
  const [section, setSection] = React.useState(initialSection);
  const [title, setTitle] = React.useState('');
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
