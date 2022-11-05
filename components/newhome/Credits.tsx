import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { CircularProgress, Dialog } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Head from 'next/head';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addCredit } from '../../modules/redux/creditsSlice';
import ErrorMessage from '../common/ErrorMessage';
import Button from '../credits/Button';
import CreditsForm from '../credits/CreditsForm';
import CreditsTable from '../credits/CreditsTable';

/**
 * A page containing student attributes and other account settings.
 */
export default function CreditsPage(): JSX.Element {
  const [openAddCredit, setOpenAddCredit] = useState(false);
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);
  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your credits</title>
      </Head>
      <UploadTranscriptDialog
        open={openTranscriptDialog}
        onClose={() => setOpenTranscriptDialog(false)}
      />
      <div className="w-full min-h-full p-5 lg:p-20 overflow-y-auto flex flex-col gap-10">
        <h1 className="text-[40px] font-semibold text-[#1C2A6D]">Credits</h1>
        <div className="flex gap-10">
          <Button onClick={() => setOpenAddCredit(true)} icon={<AddIcon />} className="w-[140px]">
            Add Credit
          </Button>
          <Button
            onClick={() => setOpenTranscriptDialog(true)}
            icon={<AddIcon />}
            className="w-[200px]"
          >
            Upload Transcript
          </Button>
        </div>
        <Modal
          open={openAddCredit}
          onClose={() => setOpenAddCredit(false)}
          className="flex items-center justify-center"
        >
          <div className="p-20 w-full sm:max-w-[500px] bg-white rounded-lg relative">
            <IconButton
              className="absolute right-10 top-10"
              onClick={() => setOpenAddCredit(false)}
            >
              <Close />
            </IconButton>
            <CreditsForm />
          </div>
        </Modal>
        <div className="shadow-md rounded-[25px] border-[#EDEFF7] border-[1px] p-10 lg:p-20 bg-white max-w-[1000px]">
          <CreditsTable />
        </div>
      </div>
    </main>
  );
}

const UploadTranscriptDialog = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>(undefined);
  const [error, setError] = useState<string>(undefined);
  const dispatch = useDispatch();
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-10 flex flex-col gap-3">
        <h1>Upload Transcript</h1>
        <p>
          Upload a PDF of your UT Dallas transcript and we&apos;ll add your earned credits to the
          page.
        </p>
        {!loading ? (
          <form
            className={'contents'}
            onSubmit={async (e) => {
              try {
                setError(null);
                e.preventDefault();

                if (loading) return;
                if (!file) {
                  setError('Must upload file');
                  return;
                }
                setLoading(true);
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/transcript', {
                  method: 'POST',
                  body: formData,
                });
                const data = (await res.json()) as { msg: string; data: string[] };
                console.log(data);
                data.data.forEach((credit) => {
                  dispatch(addCredit({ utdCourseCode: credit, semester: null }));
                });
                onClose();
              } catch (e) {
                setError(e);
              } finally {
                setLoading(false);
              }
            }}
          >
            <input
              type="file"
              name={'file'}
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setError(undefined);
              }}
            />
            <Button type="submit">Upload</Button>
          </form>
        ) : (
          <CircularProgress />
        )}
        {error && ErrorMessage(error)}
      </div>
    </Dialog>
  );
};
