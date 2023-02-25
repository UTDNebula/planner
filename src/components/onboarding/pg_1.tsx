import React, { useMemo, useState } from 'react';
import Button from '@/components/Button';
import AddIcon from '@mui/icons-material/Add';
import { UploadTranscriptDialog } from '../home/Credits';
import BuddyIcon from '@/icons/BuddyIcon';

// Array of values to choose from for form

export type PageOneTypes = {
  firstName: string;
};

export type Page1data = {
  data: PageOneTypes;
};

export default function PageOne({ data }: Page1data): JSX.Element {
  const { firstName } = data;
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);

  return (
    <div className="animate-intro">
      <div className='-mb-5'></div>
      <BuddyIcon className='flex items-center justify-center w-full'></BuddyIcon>
      <div className='pt-5'/>
      <div className='flex items-center justify-center'>
        <h2 className="text-4xl text-gray-800 tracking-tight font-extrabold inline"> Hello&nbsp;</h2>
        <h2 className="text-4xl font-extrabold text-[#4B4EFC] tracking-tight inline">{firstName}</h2>
      </div>
      <figcaption className="font-small">
        <div className="mb-1 text-[#737373] text-sm flex items-center justify-center py-2 content-center">Please upload your transcript or degree plan</div>
      </figcaption>
      <div className="flex w-[350px] flex-col gap-4 justify-center items-center">
        <UploadTranscriptDialog
          open={openTranscriptDialog}
          onClose={() => setOpenTranscriptDialog(false)}
        />
        <Button
          onClick={() => setOpenTranscriptDialog(true)}
          icon={<AddIcon />}
          className="w-[200px]"
        >
          Upload Transcript
        </Button>
      </div>
      <div className='pb-5'></div>
    </div>
  );
}
