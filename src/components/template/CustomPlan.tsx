import { useEffect, useRef, useState } from 'react';
import majorsList from '@data/majors.json';
import { RouterInputs, trpc } from '@/utils/trpc';
import { ButtonProps } from '../Button';

import { useRouter } from 'next/router';

import ErrorMessage from '../common/ErrorMessage';
import courseCode from '@/data/courseCode.json';
import { SemesterType, SemesterCode } from '@prisma/client';
import { Credit } from '../credits/types';
import { UnwrapArray } from '@/types/util-types';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Page } from './Page';
const majors = majorsList as string[];

type TakenCourse = UnwrapArray<RouterInputs['user']['createUserPlan']['takenCourses']>;

export default function CustomPlan({ onDismiss }: { onDismiss: ()=>void }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState(majors[0]);
  const [transferCredits, setTransferCredits] = useState<string[]>([]);
  const [takenCourses, setTakenCourses] = useState<TakenCourse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();

  const [page, setPageState] = useState<keyof typeof pages>(0);

  const router = useRouter();
  const utils = trpc.useContext();

  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const planId = await createUserPlan.mutateAsync({
      name,
      major,
      transferCredits,
      takenCourses,
    });
    router.push(`/app/plans/${planId}`);
  }

  const parseTranscript = async (file: File) => {
    const pdf = await import('pdfjs-dist');
    // TODO: How to use local import for this?
    pdf.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.version}/pdf.worker.js`;

    let data: PDFDocumentProxy;
    try {
      data = await pdf.getDocument(await file.arrayBuffer()).promise;
    } catch (e) {
      setError('Please ensure the selected file is a PDF file');
      return;
    }
    if (!data) {
      setError('Please ensure the selected file is a PDF file');
      return;
    }

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

  const dropRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!dropRef.current) return;
    const dropArea = dropRef.current;

    const colorClasses = ['border-[#4B4EFC]'];

    dropArea.addEventListener(
      'dragenter',
      () => {
        dropArea.classList.add(...colorClasses);
      },
      false,
    );
    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(
        eventName,
        () => {
          dropArea.classList.remove(...colorClasses);
        },
        false,
      );
    });
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(
        eventName,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        false,
      );
    });

    dropArea.addEventListener(
      'drop',
      (e) => {
        const t = e?.dataTransfer;
        const files = t?.files;
        if (files) {
          if (files.length > 1) {
            setError('Please upload only one file');
            return;
          }
          setFile(files[0]);
          parseTranscript(files[0]);
        }
      },
      false,
    );
  }, [dropRef]);

  const pages = [
    <Page
      key="custom-plan-details"
      title="Create a Custom Plan"
      subtitle="Name your plan and choose your major"
      close={onDismiss}
      actions={[
        {
          name: 'Cancel',
          onClick: onDismiss,
          color: 'secondary',
        },
        {
          name: 'Next',
          onClick: () => setPageState(1),
          color: 'primary',
        }
      ]}
    >
      
        <p className="text-sm font-semibold">Plan Name</p>
        <input
          className="w-full rounded-md border border-neutral-500 py-3 px-4 text-sm text-black/80 placeholder:text-neutral-400"
          placeholder="Name your plan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <p className="text-sm font-semibold">Choose your major</p>
        <select
          className="w-full rounded-md border border-neutral-500 py-3 px-4 text-sm text-black/80"
          onChange={(e) => setMajor(e.target.value)}
          defaultValue="placeholder"
        >
          <option disabled value="placeholder">
            <p className="text-neutral-400">Find your major...</p>
          </option>
          {majors.map((major, idx) => (
            <option key={idx}>{major}</option>
          ))}
        </select>
    </Page>,
    <Page
      key="custom-plan-transcript"
      title="Upload Transcript"
      subtitle="Upload your transcript to make your custom plan"
      close={onDismiss}
      actions={[
        {
          name: 'Back',
          onClick: () => setPageState(0),
          color: 'secondary',
        },
        {
          name: 'Create Plan',
          onClick: handleSubmit,
          color: 'primary',
          loading,
        },
      ]}
    >
      <div className="salt contents">
        <button
          ref={dropRef}
          className="group flex flex-col items-center justify-center gap-0.5 rounded-md border border-neutral-200 bg-inherit py-10 transition-colors"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <svg
            className="py-1 text-[#4B4EFC]"
            width="32"
            height="33"
            viewBox="0 0 32 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.0222 10.2776V20.2331C11.0222 21.6077 12.1365 22.722 13.5111 22.722H20.9778M11.0222 10.2776V7.78869C11.0222 6.41412 12.1365 5.2998 13.5111 5.2998H19.2179C19.5479 5.2998 19.8644 5.43092 20.0978 5.66429L25.5911 11.1575C25.8244 11.3909 25.9555 11.7074 25.9555 12.0375V20.2331C25.9555 21.6077 24.8412 22.722 23.4667 22.722H20.9778M11.0222 10.2776H8.04443C6.93986 10.2776 6.04443 11.173 6.04443 12.2776V25.2109C6.04443 26.5855 7.15875 27.6998 8.53332 27.6998H18.9778C20.0823 27.6998 20.9778 26.8044 20.9778 25.6998V22.722"
              stroke="currentColor"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-inherit">
            <span className="text-[#4B4EFC]">Upload a file</span> or drag and drop
          </p>
          <p className="text-neutral-500">PDF file up to 5MB</p>
        </button>
        {file && (
          <div className="flex w-full gap-3 justify-between items-center">
            <span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="16" fill="#F5F5FF" />
              <path
                d="M14.1334 16.0004H17.8668M14.1334 18.4893H17.8668M19.1112 21.6004H12.889C12.2017 21.6004 11.6445 21.0432 11.6445 20.3559V11.6448C11.6445 10.9575 12.2017 10.4004 12.889 10.4004H16.3646C16.5296 10.4004 16.6879 10.4659 16.8046 10.5826L20.1734 13.9515C20.2901 14.0682 20.3556 14.2264 20.3556 14.3915V20.3559C20.3556 21.0432 19.7985 21.6004 19.1112 21.6004Z"
                stroke="#4B4EFC"
                strokeWidth="1.336"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg></span>

            <div className="flex flex-col w-full">
              <p>{file.name}</p>
              <p className={`text-sm ${error ? 'text-red-500' : 'text-neutral-400'}`}>
                {Math.floor(file.size / 1000)}KB •{' '}
                {error ? 'Upload failed.' : loading ? 'Uploading...' : '100% uploaded.'}{' '}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(undefined);
                setTransferCredits([]);
                setTakenCourses([]);
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="16" fill="#F5F5FF" />
                <path
                  d="M11 21L21 11M11 11L21 21"
                  stroke="#4B4EFC"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
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
              setError(null);
              setLoading(true);
              setFile(file);
              await parseTranscript(file).catch(() => {
                setError('An error occured loading transcript');
                setLoading(false);
              });
              setLoading(false);
            }
          }}
        />
      </div>
      {error && ErrorMessage(error)}
    </Page>,
  ];

  return (
    <>
      {pages.map((p, i) => (
        <div key={i} className={i === page ? 'block' : 'hidden'}>
          {p}
        </div>
      ))}
    </>
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

export interface PageProps {
  title: string;
  subtitle: string;
  close: () => void;
  actions: {
    name: string;
    onClick: () => void;
    color: ButtonProps['color'];
    loading?: boolean;
  }[];
}
