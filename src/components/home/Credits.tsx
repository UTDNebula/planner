import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { CircularProgress, Dialog } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Head from 'next/head';
import { useState } from 'react';

import ErrorMessage from '../common/ErrorMessage';
import Button from '../credits/Button';
import CreditsForm from '../credits/CreditsForm';
import CreditsTable from '../credits/CreditsTable';
import {getDocument, GlobalWorkerOptions} from "pdfjs-dist"
import courseCode from '@/data/courseCode.json';
import { SemesterType, SemesterCode } from '@prisma/client';
import { trpc } from '@/utils/trpc';
import { Credit } from '../credits/types';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

/**
 * A page containing student attributes and other account settings.
 */
export default function CreditsPage(): JSX.Element {
  const [openAddCredit, setOpenAddCredit] = useState(false);
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);
  return (
    <main className="overflow-y-scroll h-[90vh] w-full">
      <Head>
        <title>Nebula - Your credits</title>
      </Head>
      <UploadTranscriptDialog
        open={openTranscriptDialog}
        onClose={() => setOpenTranscriptDialog(false)}
      />
      <div className="w-full  p-5 lg:p-20 overflow-y-auto flex flex-col gap-10">
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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useContext();

  const addManyCredits = trpc.credits.addManyCredits.useMutation({
    async onSuccess() {
      await utils.credits.getCredits.invalidate();
    },
  });

  const parseTranscript = async (file: File) => {
    // TODO: How to use local import for this?
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.worker.js`;
    const data = await getDocument(await file.arrayBuffer()).promise

    // store keywords that arn't "[""]"
    const keywords = [];

    for (let i = 0; i < data.numPages; i++) {
      const page = await data.getPage(i + 1);
      const textContent = (await page.getTextContent()).items.map(i=>(i as TextItem).str);

      for (const line of textContent) {
        // Separate the words by whitespace and newline
        const words = line.replace(/\n/g, ' ').split(' ');

        // store strings into the keywords array
        for (let i = 0; i < words.length; i++) {
          const line = JSON.stringify(words[i].split(' '));
          if (line != '[""]') {
            const newLine = '\\' + 'n';
            const tmp = line
              .replace('"', '')
              .replace('[', '')
              .replace(']', '')
              .replace('"', '')
              .replace(newLine, '');
            keywords.push(tmp);
          }
        }
      }
    }
    // TODO: Consider whether credit was earned or not before adding to credits list
    const credits: Credit[] = [];
    let isTransfer = true
    let term: SemesterCode = {semester: 's', year: 1970}
    for (let j = 0; j < keywords.length; j++) {
      const code = keywords[j];
      if (courseCode.includes(code) && j < keywords.length - 1) {
        const digit = keywords[j + 1].slice(0, 4).replace(/^\s+|\s+$/g, '');
        if (/^[\d-]+$/.test(digit)) {
          credits.push({semesterCode: term, courseCode: code+digit, transfer: isTransfer});
        }
      } else {
        const t = isTerm(code + " " + keywords[j+1])
        if (t) {
          term = t;
        } else if (code === "Beginning" && keywords[j+1] === "of" && keywords[j+2] === "Undergraduate" && keywords[j+3] === "Record") {
          isTransfer = false
          j += 3
        }
      }
    }
    const dedupedCredits = credits.reduce((acc, curr)=>{
      if (!acc.some(i => i.courseCode === curr.courseCode)) {
        acc.push(curr)
      }
      return acc
    }, [] as Credit[]);
    addManyCredits.mutate(dedupedCredits);
    data.destroy()
  }

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
                await parseTranscript(file);
                onClose();
              } catch (e) {
                setError("An error occurred");
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
                setFile(e.target.files ? e.target.files[0] : null);
                setError(null);
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


const isTerm = (str: string) => {
  const yr = Number(str.substring(0, 4));
  if (Number.isNaN(yr)) return false;
  const terms = ['Fall', 'Spring', 'Summer'];
  const s = terms.findIndex((term) => str.includes(term))
  if (s === -1) return false;
  const out: SemesterCode = {year: yr, semester: s == 0 ? SemesterType.f : s == 1 ? SemesterType.s : SemesterType.u}
  return out
}