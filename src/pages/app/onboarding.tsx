import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { type RouterInputs } from '@utils/trpc';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';
import React, { useEffect, useState } from 'react';
import superjson from 'superjson';

import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';

import PageOne, { PageOneTypes } from '../../components/onboarding/Onboarding_Pages/pg_1';
import PageTwo, { PageTwoTypes } from '../../components/onboarding/Onboarding_Pages/pg_2';
import { HonorsIndicator } from '../../modules/common/types';
import { authOptions } from '../api/auth/[...nextauth]';
import { SemesterCode } from '@prisma/client';

/**
 * The first onboarding page for the application.
 *
 * This will help students set up nebula according to their needs.
 */

export interface OnboardingData {
  name: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
  credits: string[];
}

const initialOnboardingData: OnboardingData = {
  name: '',
  startSemester: { semester: 'f', year: 2022 }, // TODO: Create util function for this in the future
  endSemester: { semester: 's', year: 2026 },
  credits: [],
};

export default function OnboardingPage() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
  const { name, startSemester, endSemester, credits } = onboardingData;

  const utils = trpc.useContext();

  const addProfile = trpc.user.updateUserOnboard.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const [page, setPage] = useState(0);
  const [validate, setValidate] = useState([true, false, false]);

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

    const input: RouterInputs['user']['updateUserOnboard'] = {
      name: onboardingData.name,
      majors: [], // FIX LATER
    };

    try {
      await addProfile.mutateAsync(input);
    } catch (error) {}

    router.push('/app/home');
  };

  const jsxElem = [
    // <Welcome key={0} />,
    <PageOne
      key={1}
      handleChange={setOnboardingData}
      data={{ name, startSemester, endSemester, credits }}
      handleValidate={validateForm}
    ></PageOne>,
    <PageTwo
      key={4}
      handleChange={setOnboardingData}
      data={{ ...pageTwoData }}
      handleValidate={validateForm}
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
      <div className="min-h-screen flex items-center justify-center bg-blue-400">
        <div className="w-full h-screen flex justify-center items-center p-5 transition-all sm:h-auto sm:my-16 sm:py-16 sm:px-32 sm:w-3/4 rounded shadow-2xl bg-white">
          <div className="flex flex-col items-center justify-center">
            {jsxElem[page]}
            <div className="justify-start">
              <button
                onClick={decrementPage}
                disabled={page == 0}
                className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
              >
                BACK
              </button>
              <button
                onClick={incrementPage}
                disabled={!validNextPage}
                className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
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
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
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
