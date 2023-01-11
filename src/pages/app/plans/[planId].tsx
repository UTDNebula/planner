import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import React, { Fragment, useState } from 'react';
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
import { UniqueIdentifier } from '@dnd-kit/core';

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
  const handleSemesterCreate = async () => {
    try {
      // TODO: Handle deletion errors

      const lastSemesterCode = semesters[0]?.name ? semesters[semesters.length - 1]?.name : '2023s';
      let year = lastSemesterCode?.substring(0, 4);
      let season = lastSemesterCode?.substring(4, 5);
      year = season === 'f' ? (parseInt(year) + 1).toString() : year;
      season = season === 'f' ? 's' : 'f';

      const semTitle = `${season === 'f' ? 'Fall' : 'Spring'} ${year}`;
      const semCode = `${year}${season[0].toLowerCase()}`;

      const newSemester: Semester = {
        name: semCode,
        id: new ObjectID() as unknown as UniqueIdentifier,
        courses: [],
      };

      setSemesters([...semesters, newSemester]);

      await createSemester.mutateAsync(planId);
    } catch (error) {}
  };
  const handleSemesterDelete = async () => {
    try {
      // TODO: Handle deletion errors

      setSemesters(semesters.filter((sem, idx) => idx !== semesters.length - 1));

      await deleteSemester.mutateAsync(planId);
    } catch (error) {}
  };

  const handleAddCourse = async ({
    semesterId,
    courseName,
  }: {
    semesterId: string;
    courseName: string;
  }) => {
    try {
      await addCourse.mutateAsync({ planId, semesterId, courseName });
    } catch (error) {}
  };

  const handleRemoveCourse = async ({
    semesterId,
    courseName,
  }: {
    semesterId: string;
    courseName: string;
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
    oldSemesterId: string;
    newSemesterId: string;
    courseName: string;
  }) => {
    try {
      moveCourse.mutateAsync({ planId, oldSemesterId, newSemesterId, courseName });
    } catch (error) {}
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
    const semester = { name: sem.code, id: sem.id, courses };
    return semester;
  });

  const [semesters, setSemesters] = useState(semestersInfo);

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
    handleRemoveCourse({ semesterId, courseName });
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

    setSemesters((semesters) =>
      semesters.map((semester) =>
        semester.id === targetSemester.id
          ? { ...semester, courses: [...semester.courses, newCourse] }
          : semester,
      ),
    );
    const semesterId = targetSemester.id as string;
    const courseName = newCourse.catalogCode;
    handleAddCourse({ semesterId, courseName });

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

    handleMoveCourse({ oldSemesterId, newSemesterId, courseName });
    return {
      level: 'ok',
      message: `Moved ${courseToMove.catalogCode} from ${originSemester.name} to ${destinationSemester.name}`,
    };
  };

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
        <button onClick={handleSemesterDelete}>Remove Semester</button>
        <button onClick={handleSemesterCreate}>Add Semester</button>
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

interface DVRequest {
  courses: DVCourse[];
  bypasses: DVBypass[];
  degree: string;
}

interface DVResponse {
  [requirement: string]: DVRequirement;
}

interface DVRequirement {
  courses: Record<string, number>;
  hours: number;
  isfilled: boolean;
}

interface DVBypass {
  course: string;
  requirement: string;
  hours: number;
}

interface DVCourse {
  name: string;
  department: string;
  level: number;
  hours: number;
}
