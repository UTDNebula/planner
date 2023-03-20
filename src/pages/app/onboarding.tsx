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

import { authOptions } from '../api/auth/[...nextauth]';
import Button from '@/components/Button';

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
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
  const [isModifyLoading, setIsModifyLoading] = React.useState(false);

  const handleOnboardingDataUpdate = (updatedFields: Partial<OnboardingData>) => {
    setOnboardingData({ ...onboardingData, ...updatedFields });
  };

  const { name, startSemester, endSemester } = onboardingData;

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
    const { name, startSemester, endSemester } = onboardingData;

    const input: RouterInputs['user']['updateUserOnboard'] = {
      name,
      startSemester,
      endSemester,
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
      data={{ name, startSemester, endSemester }}
      semesterOptions={{ startSemesters, endSemesters }}
      handleValidate={validateForm}
    />,
  ];
  const incrementPage = () => {
    if (page + 1 < jsxElem.length) {
      setPage(Math.min(page + 1, jsxElem.length - 1));
    } else {
      handleSubmit();
    }
  };

  useEffect(() => {
    setValidNextPage(validate[page]);
  });

  // TODO: Find better way to structure this glorified form.
  return (
    <>
      <div className="relative flex h-screen flex-col items-center justify-center space-y-10 bg-white">
        <section>
          <div className="w-auto">
            {jsxElem[page]}
            <Button
              disabled={!validNextPage}
              className="hover:bg-[#EEF2FF] hover:text-[#312E81]"
              width="full"
              size="large"
              font="large"
              isLoading={isModifyLoading}
              onClick={(e) => {
                e.stopPropagation();
                setIsModifyLoading(true);
                incrementPage();
              }}
            >
              Create Account
            </Button>
            {/* <button
              onClick={incrementPage}
              disabled={!validNextPage}
              className="w-full rounded-lg bg-[#6366F1] py-3 text-center text-[16px] font-semibold text-white hover:bg-[#EEF2FF] hover:text-[#312E81] disabled:opacity-50"
            >
              Create Account
            </button> */}
          </div>
        </section>
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
