import { TextField } from '@mui/material';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import majorsList from '@data/majors.json';
import { RouterInputs, trpc } from '@/utils/trpc';
import Button from '../Button';
import { useRouter } from 'next/router';

import ErrorMessage from '../common/ErrorMessage';
import courseCode from '@/data/courseCode.json';
import { SemesterType, SemesterCode } from '@prisma/client';
import { Credit } from '../credits/types';
import { CircularProgress } from '@mui/material';
import { UnwrapArray } from '@/types/util-types';
import AddFileIcon from '@/icons/AddFileIcon';
const majors = majorsList as string[];

type TakenCourse = UnwrapArray<RouterInputs['user']['createUserPlan']['takenCourses']>;

export default function CustomPlan({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState(majors[0]);
  const [transferCredits, setTransferCredits] = useState<string[]>([]);
  const [takenCourses, setTakenCourses] = useState<TakenCourse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();

  const router = useRouter();
  const utils = trpc.useContext();

  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const planId = await createUserPlan.mutateAsync({
      name,
      major,
      transferCredits,
      takenCourses,
    });
    router.push(`/app/plans/${planId}`);
  };

  const parseTranscript = async (file: File) => {
    const pdf = await import('pdfjs-dist');
    // TODO: How to use local import for this?
    pdf.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.worker.js`;

    const data = await pdf.getDocument(await file.arrayBuffer()).promise;

    // store keywords that arn't "[""]"
    const keywords = [];

    for (let i = 0; i < data.numPages; i++) {
      const page = await data.getPage(i + 1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore ignore-next-line
      const textContent = (await page.getTextContent()).items.map((i) => i.str);

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
    let isTransfer = true;
    let term: SemesterCode = { semester: 's', year: 1970 };
    for (let j = 0; j < keywords.length; j++) {
      const code = keywords[j];
      if (courseCode.includes(code) && j < keywords.length - 1) {
        const digit = keywords[j + 1].slice(0, 4).replace(/^\s+|\s+$/g, '');
        if (/^[\d-]+$/.test(digit)) {
          credits.push({
            semesterCode: term,
            courseCode: `${code} ${digit}`,
            transfer: isTransfer,
          });
        }
      } else {
        const t = isTerm(code + ' ' + keywords[j + 1]);
        if (t) {
          term = t;
        } else if (
          code === 'Beginning' &&
          keywords[j + 1] === 'of' &&
          keywords[j + 2] === 'Undergraduate' &&
          keywords[j + 3] === 'Record'
        ) {
          isTransfer = false;
          j += 3;
        }
      }
    }
    const dedupedCredits = credits.reduce((acc, curr) => {
      if (!acc.some((i) => i.courseCode === curr.courseCode)) {
        acc.push(curr);
      }
      return acc;
    }, [] as Credit[]);
    if (dedupedCredits.length === 0) {
      setError(
        `No credits found. Please ensure the file '${file.name}' is a UT Dallas issued transcript`,
      );
      return;
    }

    setTransferCredits(
      dedupedCredits.filter((credit) => credit.transfer).map((credit) => credit.courseCode),
    );
    setTakenCourses(
      dedupedCredits
        .filter((credit) => !credit.transfer)
        .map((credit) => ({ courseCode: credit.courseCode, semesterCode: credit.semesterCode })),
    );
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-[20px] font-semibold">Create a Custom Plan</div>
      <div className="mb-10">
        <div className="mb-10 flex flex-col">
          <TextField
            name="name"
            id="outlined-basic"
            className="w-72"
            label="Plan Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <select className="select w-72" onChange={(e) => setMajor(e.target.value)}>
          <option disabled selected>
            Choose major
          </option>
          {majors.map((major, idx) => (
            <option key={idx}>{major}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 p-10">
        <h1>Upload Transcript</h1>
        <p>
          Upload a PDF of your UT Dallas transcript and we&apos;ll add your earned credits to the
          page.
        </p>
        <Button
          type="button"
          size="large"
          icon={<AddFileIcon className="h-5 w-5" />}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          isLoading={loading}
        >
          <span className="whitespace-nowrap">Upload Transcript</span>
        </Button>
        {file && <span className="font-semibold">Uploaded: {file.name}</span>}
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          id="transcript-input"
          accept="application/pdf"
          className="hidden"
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setFile(file);
              setError(null);
              setLoading(true);
              await parseTranscript(file).catch(() =>
                setError('An error occured loading transcript'),
              );
              setLoading(false);
            }
          }}
        />
        {error && ErrorMessage(error)}
      </div>
      <Button onClick={handleSubmit}>Create Plan</Button>
      <Button onClick={() => setPage(0)}>Back</Button>
    </section>
  );
}

const isTerm = (str: string) => {
  const yr = Number(str.substring(0, 4));
  if (Number.isNaN(yr)) return false;
  const terms = ['Fall', 'Spring', 'Summer'];
  const s = terms.findIndex((term) => str.includes(term));
  if (s === -1) return false;
  const out: SemesterCode = {
    year: yr,
    semester: s == 0 ? SemesterType.f : s == 1 ? SemesterType.s : SemesterType.u,
  };
  return out;
};
