import { SemesterCode } from '@prisma/client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { ObjectID } from 'bson';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import React from 'react';
import superjson from 'superjson';

import DegreePlanPDF from '@/components/planner/DegreePlanPDF/DegreePlanPDF';
import Planner from '@/components/planner/Planner';
import { DraggableCourse, Semester, ToastMessage } from '@/components/planner/types';
import BackArrowIcon from '@/icons/BackArrowIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';
import { useTaskQueue } from '@/utils/useTaskQueue';
import { createNewYear } from '@/utils/utilFunctions';

/**
 * A page that displays the details of a specific student academic plan.
 * // TODO: Decide planner navigation UX
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const utils = trpc.useContext();
  const router = useRouter();
  const { planId } = props;
  const planQuery = trpc.plan.getPlanById.useQuery(planId);

  const { data: session } = useSession();

  // Extend Course object to contain fields for prereq validation & other stuff ig

  const { data, isLoading } = planQuery;

  const [semesters, setSemesters] = useState<Semester[]>(getSemestersInfo(data?.plan));

  const degreeData = data?.validation ?? [];

  const { addTask } = useTaskQueue({ shouldProcess: true });

  const addCourse = trpc.plan.addCourseToSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const removeCourse = trpc.plan.removeCourseFromSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const moveCourse = trpc.plan.moveCourseFromSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const createYear = trpc.plan.addYear.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const deleteYear = trpc.plan.deleteYear.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
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
  const handleYearCreate = async ({ semesterIds }: { [key: string]: string[] }) => {
    try {
      await createYear.mutateAsync({
        planId,
        semesterIds: semesterIds.map((id) => id),
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleYearDelete = async () => {
    try {
      // TODO: Handle deletion errors

      await deleteYear.mutateAsync(planId);
    } catch (error) {}
  };

  const handleAddCourse = async ({ semesterId, courseName }: { [key: string]: string }) => {
    try {
      await addCourse.mutateAsync({ planId, semesterId, courseName });
    } catch (error) {}
  };

  const handleRemoveCourse = async ({
    semesterId: semesterId,
    courseName: courseName,
  }: {
    [key: string]: string;
  }) => {
    try {
      await removeCourse.mutateAsync({ planId, semesterId, courseName });
    } catch (error) {}
  };

  const handleMoveCourse = async ({
    oldSemesterId,
    newSemesterId,
    courseName,
  }: {
    [key: string]: string;
  }) => {
    try {
      await moveCourse.mutateAsync({ planId, oldSemesterId, newSemesterId, courseName });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    return router.push('/app/home');
  };

  // Indicate UI loading
  if (isLoading) {
    return <div>Loading</div>;
  }

  const handleOnAddYear = async () => {
    const newYear: Semester[] = createNewYear(
      semesters.length ? semesters[semesters.length - 1].code : { semester: 'u', year: 2022 },
    );
    const semesterIds = newYear.map((sem) => sem.id);
    setSemesters([...semesters, ...newYear]);
    addTask({
      func: handleYearCreate,
      args: { semesterIds: semesterIds.map((id) => id.toString()) },
    });
  };

  const handleOnRemoveYear = async () => {
    setSemesters(semesters.filter((sem, idx) => idx < semesters.length - 3));
    addTask({ func: handleYearDelete, args: {} });
  };

  const handleOnRemoveCourseFromSemester = async (
    targetSemester: Semester,
    targetCourse: DraggableCourse,
  ): Promise<ToastMessage> => {
    setSemesters((semesters) =>
      semesters.map((semester) => {
        if (semester.id === targetSemester.id) {
          return {
            ...semester,
            courses: semester.courses.filter((course) => course.id !== targetCourse.id),
          };
        }

        return semester;
      }),
    );

    const semesterId = targetSemester.id.toString();
    const courseName = targetCourse.code;

    addTask({ func: handleRemoveCourse, args: { semesterId, courseName } });

    return {
      level: 'ok',
      message: `Removed ${targetCourse.code} from ${targetSemester.code}`,
    };
  };

  const handleOnAddCourseToSemester = async (
    targetSemester: Semester,
    newCourse: DraggableCourse,
  ): Promise<ToastMessage> => {
    // check for duplicate course
    const isDuplicate = Boolean(
      targetSemester.courses.find((course) => course.code === newCourse.code),
    );
    if (isDuplicate) {
      return {
        level: 'warn',
        message: `You're already taking ${newCourse.code} in ${targetSemester.code}`,
      };
    }

    setSemesters((semesters) =>
      semesters.map((semester) =>
        semester.id === targetSemester.id
          ? { ...semester, courses: [...semester.courses, newCourse] }
          : semester,
      ),
    );
    const semesterId = targetSemester.id.toString();
    const courseName = newCourse.code;
    addTask({ func: handleAddCourse, args: { semesterId, courseName } });

    return {
      level: 'ok',
      message: `Added ${newCourse.code} to ${targetSemester.code}`,
    };
  };

  const handleOnMoveCourseFromSemesterToSemester = async (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: DraggableCourse,
  ): Promise<ToastMessage> => {
    // check for duplicate course
    const isDuplicate = Boolean(
      destinationSemester.courses.find((course) => course.code === courseToMove.code),
    );
    if (isDuplicate) {
      return {
        level: 'warn',
        message: `You're already taking ${courseToMove.code} in ${destinationSemester.code}`,
      };
    }

    setSemesters((semesters) =>
      semesters.map((semester) => {
        if (semester.id === destinationSemester.id) {
          return { ...semester, courses: [...semester.courses, courseToMove] };
        }

        if (semester.id === originSemester.id) {
          return {
            ...semester,
            courses: semester.courses.filter((course) => course.id !== courseToMove.id),
          };
        }

        return semester;
      }),
    );

    const oldSemesterId = originSemester.id.toString();
    const newSemesterId = destinationSemester.id.toString();
    const courseName = courseToMove.code;

    addTask({ func: handleMoveCourse, args: { oldSemesterId, newSemesterId, courseName } });

    return {
      level: 'ok',
      message: `Moved ${courseToMove.code} from ${originSemester.code} to ${destinationSemester.code}`,
    };
  };

  return (
    <div className="w-screen flex flex-col p-4 h-screen max-h-screen overflow-y-scroll overflow-x-hidden">
      <div className=" mb-10 flex flex-row items-center gap-2">
        <BackArrowIcon
          onClick={() => router.push('/app/home')}
          className={`w-5 h-5 cursor-pointer mr-2`}
          strokeWidth={2.5}
        />
        <div className="text-2xl">My Plan</div>

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
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'EXPORT PLAN')}
          </PDFDownloadLink>
        )}
        <SettingsIcon className={`w-5 h-5 cursor-pointer ml-5`} strokeWidth={2.5} />
      </div>
      <Planner
        degreeRequirements={degreeData}
        semesters={semesters}
        onRemoveCourseFromSemester={handleOnRemoveCourseFromSemester}
        onAddCourseToSemester={handleOnAddCourseToSemester}
        onMoveCourseFromSemesterToSemester={handleOnMoveCourseFromSemesterToSemester}
        onRemoveYear={handleOnRemoveYear}
        onAddYear={handleOnAddYear}
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
