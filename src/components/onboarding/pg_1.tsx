import React, { useState } from 'react';
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
      <div className="-mb-5"></div>
      <BuddyIcon className="flex w-full items-center justify-center"></BuddyIcon>
      <div className="pt-5" />
      <div className="flex items-center justify-center">
        <h2 className="inline text-4xl font-extrabold tracking-tight text-gray-800">
          {' '}
          Hello&nbsp;
        </h2>
        <h2 className="inline text-4xl font-extrabold tracking-tight text-[#4B4EFC]">
          {firstName}
        </h2>
      </div>
      <figcaption className="font-small">
        <div className="mb-1 flex content-center items-center justify-center py-2 text-sm text-[#737373]">
          Please upload your transcript or degree plan
        </div>
      </figcaption>
      <div className="flex w-[350px] flex-col items-center justify-center gap-4">
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
      <div className="pb-5"></div>
    </div>
  );
}
