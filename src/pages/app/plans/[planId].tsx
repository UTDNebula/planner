import { PDFDownloadLink } from '@react-pdf/renderer';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import superjson from 'superjson';

import DegreePlanPDF from '@/components/planner/DegreePlanPDF/DegreePlanPDF';
import Planner from '@/components/planner/Planner';
import SettingsIcon from '@/icons/SettingsIcon';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import usePlan from '@/components/planner/usePlan';
import useSemesters from '@/components/planner/useSemesters';

/**
 * A page that displays the details of a specific student academic plan.
 * TODO: Make context if we prop drill 3+ prop values
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { planId } = props;
  const { plan, validation, isLoading, handlePlanDelete } = usePlan({ planId });
  const {
    semesters,
    handleAddCourseToSemester,
    handleAddYear,
    handleMoveCourseFromSemesterToSemester,
    handleRemoveCourseFromSemester,
    handleRemoveYear,
  } = useSemesters({ plan, planId });

  const [showTransfer, setShowTransfer] = useState(true);

  const { data: session } = useSession();

  // Indicate UI loading
  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-x-hidden overflow-y-scroll p-4">
      <div className=" mb-10 flex flex-row items-center gap-2">
        <div className="text-2xl">My Plan</div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Show Transfer Credits</span>
            <input
              type="checkbox"
              className="toggle-success toggle"
              onClick={() => setShowTransfer(!showTransfer)}
              defaultChecked
            />
          </label>
        </div>

        <div className=" ml-auto">Majors: Computer Science</div>

        <div>Minors: Cognitive Science</div>
        <div>Fast Track</div>
        <div>Import Plan</div>
        {plan && (
          <PDFDownloadLink
            className="text-base font-normal"
            document={
              <DegreePlanPDF
                studentName={session?.user?.email || ''}
                planTitle={plan.name}
                semesters={semesters}
              />
            }
            fileName={plan.name + '.pdf'}
          >
            {({ loading }) => (loading ? 'Loading document...' : 'EXPORT PLAN')}
          </PDFDownloadLink>
        )}
        <SettingsIcon className={`ml-5 h-5 w-5 cursor-pointer`} strokeWidth={2.5} />
      </div>
      <Planner
        degreeRequirements={validation}
        semesters={semesters}
        showTransfer={showTransfer}
        handleAddCourseToSemester={handleAddCourseToSemester}
        handleAddYear={handleAddYear}
        handleMoveCourseFromSemesterToSemester={handleMoveCourseFromSemesterToSemester}
        handleRemoveCourseFromSemester={handleRemoveCourseFromSemester}
        handleRemoveYear={handleRemoveYear}
      />
      <button onClick={handlePlanDelete}>Delete</button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ planId: string }>) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  const planId = context.params?.planId as string;

  await ssg.plan.getPlanById.prefetch(planId);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      planId,
    },
  };
}

PlanDetailPage.auth = true;
