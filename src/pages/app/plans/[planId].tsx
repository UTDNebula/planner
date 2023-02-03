import { SemesterCode } from '@prisma/client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { ObjectID } from 'bson';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import superjson from 'superjson';

import DegreePlanPDF from '@/components/planner/DegreePlanPDF/DegreePlanPDF';
import Planner from '@/components/planner/Planner';
import { DraggableCourse, Semester } from '@/components/planner/types';
import BackArrowIcon from '@/icons/BackArrowIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';

/**
 * A page that displays the details of a specific student academic plan.
 * TODO: Make context if we prop drill 3+ prop values
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { planId } = props;
  const planQuery = trpc.plan.getPlanById.useQuery(planId);

  const [showTransfer, setShowTransfer] = useState(true);

  const { data, isLoading } = planQuery;
  const { data: session } = useSession();
  const degreeData = data?.validation ?? [];

  const { handlePlanDelete, handleBack } = usePlannerHooks({
    planId: planId,
  });

  const [semesters, setSemesters] = useState<Semester[]>(getSemestersInfo(data?.plan));

  // Indicate UI loading
  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-x-hidden overflow-y-scroll p-4">
      <div className=" mb-10 flex flex-row items-center gap-2">
        <BackArrowIcon
          onClick={handleBack}
          className={`mr-2 h-5 w-5 cursor-pointer`}
          strokeWidth={2.5}
        />
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
        {data && (
          <PDFDownloadLink
            className="text-base font-normal"
            document={
              <DegreePlanPDF
                studentName={session?.user?.email || ''}
                planTitle={data.plan.name}
                semesters={semesters}
              />
            }
            fileName={data.plan.name + '.pdf'}
          >
            {({ loading }) => (loading ? 'Loading document...' : 'EXPORT PLAN')}
          </PDFDownloadLink>
        )}
        <SettingsIcon className={`ml-5 h-5 w-5 cursor-pointer`} strokeWidth={2.5} />
      </div>
      <Planner
        degreeRequirements={degreeData}
        semesters={semesters}
        planId={planId}
        showTransfer={showTransfer}
        setSemesters={setSemesters}
      />
      <button onClick={handlePlanDelete}>Delete</button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ planId: string }>) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
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

// Not sure if tRPC autogenerates the type
function getSemestersInfo(
  plan:
    | {
        semesters: { code: SemesterCode; id: string; courses: string[] }[];
        id: string;
        name: string;
      }
    | undefined,
): Semester[] {
  if (!plan) {
    return [];
  }
  return plan.semesters.map((sem) => {
    const courses = sem.courses.map((course: string): DraggableCourse => {
      const newCourse = {
        id: new ObjectID(),
        code: course,
      };
      return newCourse;
    });
    const semester: Semester = { code: sem.code, id: sem.id as unknown as ObjectID, courses };
    return semester;
  });
}
PlanDetailPage.auth = true;

const usePlannerHooks = ({ planId }: { planId: string }) => {
  const utils = trpc.useContext();
  const router = useRouter();

  // useMutation primitives
  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const handlePlanDelete = async () => {
    try {
      const deletedPlan = await deletePlan.mutateAsync(planId);
      if (deletedPlan) {
        router.push('/app/home');
      }

      // TODO: Handle delete error
      router.push('/app/home');
    } catch (error) {}
  };
  const handleBack = () => {
    return router.push('/app/home');
  };

  return {
    handlePlanDelete,
    handleBack,
  };
};
