import {
  Checkbox,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  Paper,
  Select,
  Box,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import React, { useState } from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { NewPlanFlowState, useCreateNewPlanFlow } from '../../../modules/planner/hooks/newPlanFlow';
import DummyData from '../../../data/dummy_onboarding.json';
import Switch from '@mui/material/Switch';
import router from 'next/router';
import { v4 as uuid } from 'uuid';
import SearchBar from '../../search/SearchBar';
import useSearch from '../../search/search';
import { Close } from '@mui/icons-material';
import { DegreeState } from './NewPlanDegreePicker';
import NewPlanDegreeGallery, { pickerValidate } from './NewPlanDegreeGallery';
import NewPlanTransferGallery, { CreditState } from './NewPlanTransferGallery';
import { HonorsIndicator } from '../../../modules/common/types';

export type NewPlanProps = {
  degree: DegreeState[];
};

export type TransferCreditProps = {
  creditState: CreditState[];
};

export type SelectMajorDialogScreenProps = {
  selectedMajors: string[]; // TODO: Replace this w/ Major data type
  addMajor: (elm: string) => void; // TODO: Replace "elm" with Major data type
  handleChange: React.Dispatch<React.SetStateAction<NewPlanProps>>;
  props: NewPlanProps;
};

/**
 * Screen in NewPlanDialog flow that allows the user
 * to choose their plan major
 */
export function SelectMajorDialogScreen({
  selectedMajors,
  addMajor,
  props,
  handleChange,
}: SelectMajorDialogScreenProps) {
  /* Search bar functionality */

  const { results, updateQuery } = useSearch({ getData: getMajors });

  const { degree } = props;

  const handlePickerChange = (updateDegree: DegreeState[]) => {
    handleChange({ ...props, degree: updateDegree });
  };

  const checkValidate = () => {
    const isValid = pickerValidate(degree) ? true : false;
  };

  const handleSearch = (query: string) => {
    updateQuery(query);
  };

  // Run updateQuery on dialog screen load
  React.useEffect(() => {
    updateQuery('');
    checkValidate();
  }, [props]);

  return (
    <div>
      <div className="grid grid-cols-2" style={{ height: '75vh', maxWidth: '100vw' }}>
        <div>
          <Box sx={{ width: '75%', paddingLeft: '4rem' }} style={{ flexDirection: 'column' }}>
            <Typography variant="h2" component="div">
              What&apos;s your degree?
            </Typography>
          </Box>
          <Container
            style={{
              paddingTop: '4rem',
              width: '35vw',
              paddingLeft: '4rem',
              position: 'absolute',
            }}
          >
            <div className="flex flex-col border-2" style={{ height: '40vh', width: '25vw' }}>
              <div className="m-2">
                <SearchBar updateQuery={handleSearch} />
              </div>
              <div className="scrollbar-hide overflow-y-auto overflow-x-auto flex flex-col ml-4 items-start">
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
          </Container>
        </div>
        <div className="flex flex-col p-2">
          {selectedMajors.map((elm) => {
            const tempDegreeType = [
              {
                degree: elm,
                degreeType: 'Major',
                valid: true,
              },
            ];
            return (
              <NewPlanDegreeGallery
                key={elm}
                degree={tempDegreeType}
                handleChange={handlePickerChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type TransferDialogScreenProps = {
  handleChange: React.Dispatch<React.SetStateAction<TransferCreditProps>>;
  props: TransferCreditProps;
};

export function TransferDialogScreen({
  handleChange,
  props,
}: TransferDialogScreenProps): JSX.Element {
  const { creditState } = props;

  const handleTransferChange = (credits: CreditState[]) => {
    handleChange({ creditState: credits });
  };

  return (
    <div className="grid grid-cols-2" style={{ height: '75vh' }}>
      <Box sx={{ width: '75%', paddingLeft: '4rem' }} style={{ flexDirection: 'column' }}>
        <Typography variant="h2" component="div" fontWeight="bold">
          Any transfer credits?
        </Typography>
      </Box>
      <NewPlanTransferGallery creditState={creditState} handleChange={handleTransferChange} />
    </div>
  );
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
  return Object.values(data).slice(0, 78);
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

  const [major, setMajor] = useState<NewPlanProps>({
    degree: [
      {
        degree: '',
        degreeType: '',
        valid: false,
      },
    ],
  });

  const [transferData, setTransferData] = useState<TransferCreditProps>({
    creditState: [
      {
        id: 0,
        subject: '',
        course: '',
        type: '',
        apTest: '',
        apScore: '',
        ibTest: '',
        ibLevel: '',
        ibScore: '',
        clepTest: '',
        clepScore: '',
      },
    ],
  });

  // const handleTransferChange = (credits: CreditState[]) => {
  //   handleChange({ creditState: credits });
  // };

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
    contents = (
      <SelectMajorDialogScreen
        selectedMajors={selectedMajors}
        addMajor={addMajor}
        props={{ ...major }}
        handleChange={setMajor}
      />
    );
  } else if (planState === 'TRANSFER_COURSES') {
    contents = <TransferDialogScreen props={transferData} handleChange={setTransferData} />;
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
      <Dialog
        style={{ backgroundColor: '#1E634D' }}
        open={openDialog}
        onClose={finish}
        fullWidth={true}
        maxWidth={'lg'}
        disableEnforceFocus={true}
      >
        <div className="flex">
          <IconButton className="p-4" size="large">
            <Close htmlColor="#030104" />
          </IconButton>
          <IconButton
            onClick={goBack}
            sx={{
              position: 'absolute',
              right: 50,
            }}
            className="p-4"
            size="large"
          >
            <ArrowBack htmlColor="#030104" />
          </IconButton>
          <IconButton
            onClick={goForward}
            sx={{
              position: 'absolute',
              right: 8,
            }}
            className="p-4"
            size="large"
          >
            <ArrowForward htmlColor="#030104" />
          </IconButton>
        </div>
        <div className="p-2">{contents}</div>
      </Dialog>
    </div>
  );
}
