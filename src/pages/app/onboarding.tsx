import { SemesterCode, SemesterType } from '@prisma/client';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { type RouterInputs } from '@utils/trpc';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import React, { useEffect, useState } from 'react';
import superjson from 'superjson';

import { Credit } from '@/components/credits/types';
import Welcome, { WelcomeTypes } from '@/components/onboarding/welcome';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';
import { generateSemesters } from '@/utils/utilFunctions';

import { PageTwoTypes } from '../../components/onboarding/pg_2';
import { authOptions } from '../api/auth/[...nextauth]';
import dynamic from 'next/dynamic';

/**
 * The first onboarding page for the application.
 *
 * This will help students set up nebula according to their needs.
 */

export interface OnboardingData {
  firstName: string;
  lastName: string;
  name: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
  credits: Credit[];
}

const startSemesters = generateSemesters(12, new Date().getFullYear() - 6, SemesterType.f, false)
  .reverse()
  .map((sem) => sem.code);

const endSemesters = generateSemesters(12, new Date().getFullYear(), SemesterType.f, false)
  .reverse()
  .map((sem) => sem.code);

const initialOnboardingData: OnboardingData = {
  firstName: '',
  lastName: '',
  name: '',
  startSemester: startSemesters[1], // TODO: Create util function for this in the future
  endSemester: endSemesters[6],
  credits: [],
};

export default function OnboardingPage() {
  // dynamically importing pg_1 & 2 bc library too phat
  const PageOne = dynamic(() => import('@/components/onboarding/pg_1'), { ssr: false });
  const PageTwo = dynamic(() => import('@/components/onboarding/pg_2'), { ssr: false });

  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);

  const handleOnboardingDataUpdate = (updatedFields: Partial<OnboardingData>) => {
    setOnboardingData({ ...onboardingData, ...updatedFields });
  };

  const { firstName, lastName, name, startSemester, endSemester, credits } = onboardingData;

  const utils = trpc.useContext();

  const addProfile = trpc.user.updateUserOnboard.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const [page, setPage] = useState(0);
  const [validate, setValidate] = useState([true, true, true]);

  const [validNextPage, setValidNextPage] = useState(false);

  const router = useRouter();

  const validateForm = (value: boolean) => {
    const temp = validate;
    temp[page] = value;
    setValidate(temp);
  };

  // const { updateName } = useAuthContext();

  const handleSubmit = async () => {
    // TODO: Send data to firebase if creating account
    console.log('Send data to firebase & go to /app', onboardingData);

    const { name, startSemester, endSemester, credits } = onboardingData;

    const input: RouterInputs['user']['updateUserOnboard'] = {
      name,
      startSemester,
      endSemester,
      credits,
    };

    try {
      await addProfile.mutateAsync(input);
    } catch (error) {}

    router.push('/app/home');
  };

  const jsxElem = [
    <Welcome
      key={0}
      handleChange={handleOnboardingDataUpdate as (updatedFields: Partial<WelcomeTypes>) => void}
      data={{ firstName, lastName, startSemester, endSemester }}
      semesterOptions={{ startSemesters, endSemesters }}
      handleValidate={validateForm}
    />,
    <PageOne key={1} data={{ firstName }}></PageOne>,
    <PageTwo
      key={2}
      handleChange={
        handleOnboardingDataUpdate as React.Dispatch<React.SetStateAction<PageTwoTypes>>
      }
      data={{ credits, firstName }}
      startSemester={startSemester}
    ></PageTwo>,
  ];
  const incrementPage = () => {
    if (page + 1 < jsxElem.length) {
      setPage(Math.min(page + 1, jsxElem.length - 1));
    } else {
      handleSubmit();
    }
  };
  const decrementPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  useEffect(() => {
    setValidNextPage(validate[page]);
  });

  // TODO: Find better way to structure this glorified form.
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB]">
        <div className="flex text-3xl font-extrabold text-[#111827]">planner.</div>
        <div className="flex h-screen items-center justify-center border-2 border-yellow-900 bg-[#FFFFFF] p-5 shadow-2xl transition-all sm:my-4 sm:h-auto  sm:py-10 sm:px-32">
          <div className="flex flex-col items-center justify-center ">
            {jsxElem[page]}
            <div className="justify-start">
              <button
                onClick={decrementPage}
                disabled={page == 0}
                className="mr-10 rounded font-bold text-[#4B4EFC] disabled:opacity-50"
              >
                BACK
              </button>
              <button
                onClick={incrementPage}
                disabled={!validNextPage}
                className="rounded font-bold text-[#4B4EFC] disabled:opacity-50"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.user.getUser.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
