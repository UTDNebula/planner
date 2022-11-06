import MenuIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, IconButton, Theme, Toolbar, Typography } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { useAuthContext } from '../../../modules/auth/auth-context';
import { createSamplePlan, Semester } from '../../../modules/common/data';
import { RootState } from '../../../modules/redux/store';
import UserDegreePlanPDF from '../GeneratePDF/GeneratePDF';
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
        backgroundColor: '#3E61ED',
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
  updateSemesters: (semesters: Semester[]) => void;
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
  updateSemesters,
}: PlanningToolbarProps) {
  const { signOut, user } = useAuthContext();

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  const studentPlanRaw = useSelector((state: RootState) => state.userData.plans[planId]);

  const studentPlan = studentPlanRaw !== undefined ? studentPlanRaw : createSamplePlan();

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
      <Toolbar className="flex flex-row gap-x-4">
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
        <Typography variant="h6" className={classes.title + ' text-white'}>
          {planTitle}
        </Typography>
        <button
          onClick={onValidate}
          className="text-base font-normal bg-white text-[#1C2A6D] p-2 rounded-lg hover:bg-gray-50"
        >
          Validate plan
        </button>
        <PDFDownloadLink
          className="text-base font-normal text-[#1C2A6D] bg-white  p-2 rounded-lg hover:bg-gray-50"
          document={<UserDegreePlanPDF name={user.name} studentPlan={studentPlan} />}
          fileName={studentPlan.title + '.pdf'}
        >
          {({ blob, url, loading, error }) => (error ? 'Export Error' : 'Export Plan')}
        </PDFDownloadLink>

        <input
          id="planUpload"
          className={styles.visuallyHidden}
          type="file"
          accept="application/json"
          onChange={onImportPlan}
        />
        <label htmlFor="planUpload">
          {/* This must render as a span for the input to function */}
          <button className="text-base font-normal text-[#1C2A6D] bg-white p-2 rounded-lg hover:bg-gray-50">
            Import plan
          </button>
        </label>
        <IconButton onClick={handleSettings} className="" size="large">
          <SettingsIcon color="inherit" className="text-white" />
        </IconButton>
      </Toolbar>
      <SettingsDialog
        planId={planId}
        isOpen={dialog}
        setOpen={setDialog}
        updatePlanTitle={setPlanTitle}
        updateSemesters={updateSemesters}
      />
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
