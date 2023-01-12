import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import React, { Fragment, useEffect, useState } from 'react';
import superjson from 'superjson';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';
import Planner from '@/components/planner/Planner';
import validationData from '@/data/dummyValidation.json';
import { DegreeRequirementGroup, Semester, ToastMessage } from '@/components/planner/types';
import { Course } from '@/modules/common/data';
import { v4 as uuid } from 'uuid';
import { ObjectID } from 'bson';

function useTaskQueue(params: { shouldProcess: boolean }): {
  tasks: ReadonlyArray<Task>;
  isProcessing: boolean;
  addTask: (task: Task) => void;
} {
  const [queue, setQueue] = React.useState<{
    isProcessing: boolean;
    tasks: Array<Task>;
  }>({ isProcessing: false, tasks: [] });

  React.useEffect(() => {
    if (!params.shouldProcess) return;
    if (queue.tasks.length === 0) return;
    if (queue.isProcessing) return;

    console.log(queue);

    const { func, args } = queue.tasks[0];
    console.log(args);
    setQueue((prev) => ({
      isProcessing: true,
      tasks: prev.tasks.slice(1),
    }));

    Promise.resolve(func(args)).finally(() => {
      setQueue((prev) => ({
        isProcessing: false,
        tasks: prev.tasks,
      }));
    });
  }, [queue, params.shouldProcess]);

  return {
    tasks: queue.tasks,
    isProcessing: queue.isProcessing,
    addTask: React.useCallback((task) => {
      setQueue((prev) => ({
        isProcessing: prev.isProcessing,
        tasks: [...prev.tasks, task],
      }));
    }, []),
  };
}

type Task = {
  func: (args: { [key: string]: string }) => Promise<void> | void;
  args: { [key: string]: string };
};

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

  const { data, isLoading } = planQuery;

  const { tasks, isProcessing, addTask } = useTaskQueue({ shouldProcess: true });

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

  const createSemester = trpc.plan.addEmptySemesterToPlan.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const deleteSemester = trpc.plan.deleteSemester.useMutation({
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
  const handleSemesterCreate = async ({ semesterId }: { [key: string]: string }) => {
    try {
      // TODO: Handle deletion errors

      await createSemester.mutateAsync({ planId, semesterId });
    } catch (error) {}
  };
  const handleSemesterDelete = async () => {
    try {
      // TODO: Handle deletion errors

      await deleteSemester.mutateAsync(planId);
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

  const [degreeData, setDegreeData] = useState<DegreeRequirementGroup[]>(validationData);

  // Indicate UI loading
  if (isLoading) {
    return <div>Loading</div>;
  }

  // Extend Course object to contain fields for prereq validation & other stuff ig

  const semestersInfo: Semester[] = data!.semesters.map((sem, idx) => {
    const courses = sem.courses.map((course, index): Course => {
      const newCourse = {
        id: uuid(),
        description: '',
        title: 'temp',
        catalogCode: course,
        creditHours: 3,
      };
      return newCourse;
    });
    const semester: Semester = { name: sem.code, id: sem.id, courses };
    return semester;
  });

  const [semesters, setSemesters] = useState(semestersInfo);

  const handleOnAddSemester = async () => {
    const lastSemesterCode = semesters[0]?.name ? semesters[semesters.length - 1]?.name : '2023s';
    let year = lastSemesterCode?.substring(0, 4);
    let season = lastSemesterCode?.substring(4, 5);
    year = season === 'f' ? (parseInt(year) + 1).toString() : year;
    season = season === 'f' ? 's' : 'f';

    const semTitle = `${season === 'f' ? 'Fall' : 'Spring'} ${year}`;
    const semCode = `${year}${season[0].toLowerCase()}`;

    const id = new ObjectID() as unknown as string;

    const newSemester: Semester = {
      name: semCode,
      id: id,
      courses: [],
    };

    setSemesters([...semesters, newSemester]);
    addTask({ func: handleSemesterCreate, args: { semesterId: id } });
    console.log('THINK');
  };

  const handleOnRemoveSemester = async () => {
    setSemesters(semesters.filter((sem, idx) => idx !== semesters.length - 1));
    addTask({ func: handleSemesterDelete, args: {} });
  };

  const handleOnRemoveCourseFromSemester = async (
    targetSemester: Semester,
    targetCourse: Course,
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

    const semesterId = targetSemester.id as string;
    const courseName = targetCourse.catalogCode;

    addTask({ func: handleRemoveCourse, args: { semesterId, courseName } });

    return {
      level: 'ok',
      message: `Removed ${targetCourse.catalogCode} from ${targetSemester.name}`,
    };
  };

  const handleOnAddCourseToSemester = async (
    targetSemester: Semester,
    newCourse: Course,
  ): Promise<ToastMessage> => {
    // check for duplicate course
    const isDuplicate = Boolean(
      targetSemester.courses.find((course) => course.catalogCode === newCourse.catalogCode),
    );
    if (isDuplicate) {
      return {
        level: 'warn',
        message: `You're already taking ${newCourse.catalogCode} in ${targetSemester.name}`,
      };
    }

    // alert(targetSemester.id);

    setSemesters((semesters) =>
      semesters.map((semester) =>
        semester.id === targetSemester.id
          ? { ...semester, courses: [...semester.courses, newCourse] }
          : semester,
      ),
    );
    const semesterId = targetSemester.id as string;
    const courseName = newCourse.catalogCode;
    addTask({ func: handleAddCourse, args: { semesterId, courseName } });

    return {
      level: 'ok',
      message: `Added ${newCourse.catalogCode} to ${targetSemester.name}`,
    };
  };

  const handleOnMoveCourseFromSemesterToSemester = async (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: Course,
  ): Promise<ToastMessage> => {
    // check for duplicate course
    const isDuplicate = Boolean(
      destinationSemester.courses.find((course) => course.catalogCode === courseToMove.catalogCode),
    );
    if (isDuplicate) {
      return {
        level: 'warn',
        message: `You're already taking ${courseToMove.catalogCode} in ${destinationSemester.name}`,
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

    const oldSemesterId = originSemester.id as string;
    const newSemesterId = destinationSemester.id as string;
    const courseName = courseToMove.catalogCode;

    addTask({ func: handleMoveCourse, args: { oldSemesterId, newSemesterId, courseName } });

    return {
      level: 'ok',
      message: `Moved ${courseToMove.catalogCode} from ${originSemester.name} to ${destinationSemester.name}`,
    };
  };

  // Queue time
  // const [queue, setQueue] = useState<Array<unknown>>([]);

  // // useEffect(() => {
  // //   if (queue.length > 0) {
  // //     const runAsync = async () => {
  // //       console.log('TEST');
  // //       const func = queue[0][0];
  // //       const args = queue[0][1];
  // //       await func(args);
  // //       setQueue([...queue.slice(1)]);
  // //     };
  // //     runAsync();
  // //   }
  // // }, [queue]);

  return (
    <div className="w-screen flex flex-col bg-[#FFFFFF] p-[44px]">
      <div className="mt-4 mb-10 flex flex-row">
        <button onClick={handleBack}>Back</button>
        <div className="text-2xl">My Plan</div>{' '}
      </div>
      <Planner
        degreeRequirements={degreeData}
        semesters={semesters}
        onRemoveCourseFromSemester={handleOnRemoveCourseFromSemester}
        onAddCourseToSemester={handleOnAddCourseToSemester}
        onMoveCourseFromSemesterToSemester={handleOnMoveCourseFromSemesterToSemester}
      />
      <div>
        <button onClick={handleOnRemoveSemester}>Remove Semester</button>
        <button onClick={handleOnAddSemester}>Add Semester</button>
      </div>
      <button onClick={handlePlanDelete}>Delete Plan</button>
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
  console.log('planId', planId);

  await ssg.plan.getPlanById.prefetch(planId);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      planId,
    },
  };
}
