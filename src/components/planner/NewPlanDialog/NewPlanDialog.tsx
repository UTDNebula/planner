import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Checkbox, Dialog, DialogTitle, Select } from '@mui/material';
import Switch from '@mui/material/Switch';
import router from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';

import DummyData from '../../../data/majors.json';
import { NewPlanFlowState, useCreateNewPlanFlow } from '../../../modules/planner/hooks/newPlanFlow';
import useSearch from '../../search/search';
import SearchBar from '../../search/SearchBar';

export type NavigationBarProps = {
  planState: NewPlanFlowState;
  goBack: () => void;
  goForward: () => void;
  finish: () => void;
};

// TODO: Make NewPlan data type

/**
 * Bottom navigation bar for NewPlanDialog
 */
export function NavigationBar({ planState, goBack, goForward, finish }: NavigationBarProps) {
  // TODO: Create a way to indicate how far the user is in NewPlanDialog
  return (
    <nav className="flex flex-row items-center justify-center text-xs gap-2 bg-gray-300">
      <ArrowLeftIcon onClick={goBack} />
      <div className="rounded-full w-12 h-12 text-white bg-black flex justify-center items-center">
        1
      </div>
      <div>Choose degree plan</div>
      <div className="rounded-full w-12 h-12 text-white bg-black flex justify-center items-center">
        2
      </div>
      <div>Transfer Courses</div>
      <div className="rounded-full w-12 h-12 text-white bg-black flex justify-center items-center">
        3
      </div>
      <div>Everything else</div>
      <ArrowRightIcon onClick={goForward} />
    </nav>
  );
}

export type SelectMajorDialogScreenProps = {
  selectedMajors: string[]; // TODO: Replace this w/ Major data type
  addMajor: (elm: string) => void; // TODO: Replace "elm" with Major data type
};

/**
 * Screen in NewPlanDialog flow that allows the user
 * to choose their plan major
 */
export function SelectMajorDialogScreen({
  selectedMajors,
  addMajor,
}: SelectMajorDialogScreenProps) {
  /* Search bar functionality */

  const { results, updateQuery } = useSearch({
    getData: getMajors,
    initialQuery: '',
    filterFn: (elm, query) => elm.toLowerCase().includes(query.toLowerCase()),
  });

  const handleSearch = (query: string) => {
    updateQuery(query);
  };

  return (
    <div className="grid grid-cols-2">
      {/* TODO: Put this into container component */}
      <div className="flex flex-col border-2">
        <div className="m-2">
          <SearchBar updateQuery={handleSearch} />
        </div>
        <div className="overflow-scroll h-40 flex flex-col border-4 ml-4 items-start">
          {results &&
            results.map((elm) => {
              return (
                <div key={elm} className="my-1">
                  <button onClick={() => addMajor(elm)}>{elm}</button>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col p-2">
        <div className="text-xl"> Selected Majors </div>
        <div className="justify-start h-20 overflow-scroll">
          {selectedMajors.map((elm) => {
            return (
              <div key={elm} className="flex flex-row items-center">
                <Checkbox />
                <div>{elm}</div>
              </div>
            );
          })}
        </div>
        <hr className="h-0.5 bg-black" />
        {/* Add functionality to this */}
        <div className="flex flex-row">
          <Switch />
          <div>Use existing plan of study</div>
        </div>
      </div>
    </div>
  );
}

export function TransferCreditDialogScreen() {
  return <div>Transfer Credit page coming soon!</div>;
}

// TODO: Come up with a better name for this function
export function OtherDialogScreen() {
  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-start">
        <div>How fast do you want to progress through your degree?</div>
        <Select label=""></Select>
      </div>
      <div className="flex flex-col items-start">
        <div>Do you want to do fast track?</div>
        <Select label=""></Select>
      </div>
      <div className="flex flex-col items-start">
        <div>Do you want to take summer classes?</div>
        <Select label=""></Select>
      </div>
      <div className="flex flex-col items-start">
        <div>Do you plan on taking any breaks?</div>
        <Select label=""></Select>
      </div>
      <div className="flex flex-col items-start">
        <div>Any other degree requirements?</div>
        <Select label=""></Select>
      </div>
    </div>
  );
}

export async function getMajors() {
  const data = await import('../../../data/majors.json');
  // TODO: Fix this!!!!
  return Object.values(data).slice(0, 6) as unknown as string[];
}

export type NewPlanDialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
};

/**
 * A dialog that allows a user to initialize a new CoursePlan.
 */
export default function NewPlanDialog({
  openDialog,
  setOpenDialog,
}: NewPlanDialogProps): JSX.Element {
  const { planState, goForward, goBack, reset } = useCreateNewPlanFlow();
  const majors = DummyData;
  const handleSearchSelection = () => {
    console.log('Not yet implemented');
  };

  const [selectedMajors, setSelectedMajors] = React.useState<string[]>([]);
  const addMajor = (elm: string) => {
    setSelectedMajors([...selectedMajors, elm]);
  };

  // Replace w/ Ben's degree plan generation algorithm
  const generateDegreePlan = async () => {
    console.log('Replace me');
  };

  /**
   * Reset dialog state and dismiss this dialog.
   */
  const finish = async () => {
    // Reset dialog screen
    reset();
    setSelectedMajors([]);
    setOpenDialog(false);

    // Start generating degree plan
    // TODO: Aggregate all necessary data for generateDegreePlan
    if (planState === 'SELECT_ADDITIONS') {
      await generateDegreePlan();
      // Generate route id
      const routeID = uuid();
      router.push(`/app/plans/${routeID}`);
    }
  };

  let contents;
  if (planState === 'SELECT_MAJOR') {
    contents = <SelectMajorDialogScreen selectedMajors={selectedMajors} addMajor={addMajor} />;
  } else if (planState === 'TRANSFER_COURSES') {
    contents = <TransferCreditDialogScreen />;
  } else {
    contents = (
      <div>
        <OtherDialogScreen />
        <div className="flex justify-end items-end">
          {planState === 'SELECT_ADDITIONS' && <button onClick={finish}>Done</button>}
        </div>
      </div>
    );
  }

  // Select major
  // Add transfer courses
  return (
    <div>
      <header>{/* Title */}</header>
      <Dialog open={openDialog} onClose={finish} disableEnforceFocus={true}>
        <DialogTitle>Create degree plan</DialogTitle>
        <div className="p-2">{contents}</div>
        <NavigationBar
          planState={planState}
          goBack={goBack}
          goForward={goForward}
          finish={finish}
        />
      </Dialog>
    </div>
  );
}
