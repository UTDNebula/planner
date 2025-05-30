import { Prisma, SemesterType, TemplateDataType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { createNewSemesterCode, isSemCodeEqual, isEarlierSemester } from '@/utils/utilFunctions';
import { computeProfileWithSemesterCode } from '@/../prisma/utils';

import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  // Protected route: route uses session user id
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userInfo = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        email: true,
        emailVerified: true,
        onboardingComplete: true,
        profile: true,
        seenHomeOnboardingModal: true,
        seenPlanOnboardingModal: true,
      },
    });
    if (!userInfo) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return {
      ...userInfo,
      profile: userInfo.profile ? computeProfileWithSemesterCode(userInfo.profile) : null,
    };
  }),
  // Protected route: route uses session user id
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.prisma.user.delete({ where: { id: userId } });
  }),
  // Protected route: route uses session user id
  updateUserProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        startSemester: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
        endSemester: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profile: {
            update: {
              name: input.name,
              startYear: input.startSemester.year,
              startSemester: input.startSemester.semester,
              endYear: input.endSemester.year,
              endSemester: input.endSemester.semester,
            },
          },
        },
      });
      console.table(user);
      return user;
    }),
  // Protected route: route uses session user id
  updateUserOnboard: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        startSemester: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
        endSemester: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          onboardingComplete: true,
          profile: {
            upsert: {
              update: {
                name: input.name,
                startYear: input.startSemester.year,
                startSemester: input.startSemester.semester,
                endYear: input.endSemester.year,
                endSemester: input.endSemester.semester,
              },
              create: {
                name: input.name,
                startYear: input.startSemester.year,
                startSemester: input.startSemester.semester,
                endYear: input.endSemester.year,
                endSemester: input.endSemester.semester,
              },
            },
          },
        },
      });

      console.table(user);
      return user;
    }),
  /**
   * Create a new user plan
   *  - takes in plan name, major, transfer credits, and courses already taken
   */
  // Protected route: route uses session user id
  createUserPlan: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        major: z.string(),
        takenCourses: z.array(
          z.object({
            courseCode: z.string(),
            semesterCode: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
          }),
        ),
        transferCredits: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const planId = uuidv4();

      const { name, major, takenCourses, transferCredits } = input;
      const bypasses: string[] = [];

      // Create degree requirements
      const degreeRequirements: Prisma.DegreeRequirementsCreateNestedOneWithoutPlanInput = {
        create: {
          major, // Hardcode for now
          bypasses,
        },
      };

      const user = await ctx.prisma.user.findFirst({
        where: { id: userId },
        select: {
          profile: true,
        },
      });

      if (!user || !user.profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const { startSemesterCode: userStartSemester, endSemesterCode: userEndSemester } =
        computeProfileWithSemesterCode(user.profile);

      const earliestSemFromTranscript =
        takenCourses.length > 0
          ? takenCourses.reduce(
              (prev, curr) =>
                isEarlierSemester(prev.semesterCode, curr.semesterCode) ? prev : curr,
              takenCourses[0],
            ).semesterCode
          : userStartSemester;

      const latestSemFromTranscript =
        takenCourses.length > 0
          ? takenCourses.reduce(
              (prev, curr) =>
                !isEarlierSemester(prev.semesterCode, curr.semesterCode) ? prev : curr,
              takenCourses[0],
            ).semesterCode
          : userEndSemester;

      const startSemester = isEarlierSemester(userStartSemester, earliestSemFromTranscript)
        ? userStartSemester
        : earliestSemFromTranscript;

      const endSemester = !isEarlierSemester(userEndSemester, latestSemFromTranscript)
        ? userEndSemester
        : latestSemFromTranscript;

      if (!isEarlierSemester(startSemester, endSemester)) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Start semester cannot be equal or later than end semester',
        });
      }

      let currSem = startSemester;
      const semesterData: Prisma.SemesterCreateWithoutPlanInput[] = [];

      // Create semesters and add courses from transcript to each semester
      while (isEarlierSemester(currSem, endSemester) || isSemCodeEqual(currSem, endSemester)) {
        // Create new semester

        const courses: string[] = [];

        for (const course of takenCourses) {
          if (isSemCodeEqual(course.semesterCode, currSem)) {
            courses.push(course.courseCode);
          }
        }

        const newSem: Prisma.SemesterCreateWithoutPlanInput = {
          semester: currSem.semester,
          year: currSem.year,
          color: '',
          courses: createCoursesForUserPlan(courses),
        };

        semesterData.push(newSem);

        currSem = createNewSemesterCode(currSem);
      }

      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: semesterData,
      };

      const plans: Prisma.PlanUpdateManyWithoutUserNestedInput = {
        create: {
          id: planId,
          name: name,
          semesters: semesters,
          requirements: degreeRequirements,
          transferCredits,
          startYear: startSemester.year,
          startSemester: startSemester.semester,
          endYear: endSemester.year,
          endSemester: endSemester.semester,
        },
      };

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          plans,
        },
        select: {
          plans: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              id: true,
            },
          },
        },
      });
      return updatedUser.plans[0].id;
    }),
  /**
   * Duplicates a user plan based on an existing one
   *  - Takes in id, major
   */
  // Protected route: route uses session user id
  duplicateUserPlan: protectedProcedure
    .input(z.object({ id: z.string(), major: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const planId = uuidv4();

      const { id, major } = input;
      // fetch plan from database with id
      const plan = await ctx.prisma.plan.findFirst({
        where: {
          id: id,
        },
        include: {
          semesters: {
            include: {
              courses: true,
            },
          },
        },
      });

      // Create degree requirements
      const degreeRequirements: Prisma.DegreeRequirementsCreateNestedOneWithoutPlanInput = {
        create: {
          major, // Hardcode for now
        },
      };

      // Create semesters based on existing plan
      const semesterData: Prisma.SemesterCreateWithoutPlanInput[] = [];

      // Push existing semester data to new plan
      for (let i = 0; i < plan!.semesters.length; i++) {
        const courses = {
          create: plan!.semesters[i].courses.map((course) => {
            return { code: course.code, color: course.color };
          }),
        };

        const semData: Prisma.SemesterCreateWithoutPlanInput = {
          courses,
          semester: plan!.semesters[i].semester,
          year: plan!.semesters[i].year,
          color: plan!.semesters[i].color,
        };
        semesterData.push(semData);
      }

      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: semesterData, // Prepopulate with semester
      };

      const plans: Prisma.PlanUpdateManyWithoutUserNestedInput = {
        create: {
          id: planId,
          name: 'Copy-' + plan!.name,
          semesters: semesters,
          requirements: degreeRequirements,
          transferCredits: plan!.transferCredits,
          startYear: plan!.startYear,
          startSemester: plan!.startSemester,
          endYear: plan!.endYear,
          endSemester: plan!.endSemester,
        },
      };

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          plans: plans,
        },
        select: {
          plans: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              id: true,
            },
          },
        },
      });
      return updatedUser.plans[0].id;
    }),

  /**
   * Creates user plan based on a pre-made template
   *  - ignores credits for now
   *  - always 4 years
   */
  // Protected route: route uses session user id
  createTemplateUserPlan: protectedProcedure
    .input(z.object({ name: z.string(), templateName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name, templateName } = input;
      const userId = ctx.session.user.id;
      try {
        const template = await ctx.prisma.template.findFirst({
          where: {
            id: templateName,
          },
          include: {
            templateData: {
              select: {
                semester: true,
                items: {
                  select: {
                    name: true,
                    type: true,
                  },
                },
              },
              orderBy: {
                semester: 'asc',
              },
            },
          },
        });
        if (!template || !template.name) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Template not found',
          });
        }

        const { name: major, templateData } = template;

        // Get user info

        const user = await ctx.prisma.user.findFirst({
          where: { id: userId },
          select: {
            profile: true,
          },
        });

        if (!user || !user.profile) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Add template courses to semesters
        const semesterData = addTemplateCoursesToPlan({
          startYear: user.profile.startYear,
          templateData,
        });

        const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
          create: semesterData, // Prepopulate with semester
        };

        // Create degree requirements
        const degreeRequirements: Prisma.DegreeRequirementsCreateNestedOneWithoutPlanInput = {
          create: {
            major,
            bypasses: [],
          },
        };

        // For template plans, always add courses to Fall of whatever year they start with
        const startYear =
          user.profile.startSemester === 'f' ? user.profile.startYear : user.profile.startYear - 1;
        const endYear = startYear + 4;
        const startSemester: SemesterType = 'f';
        const endSemester: SemesterType = 'u';

        const plans: Prisma.PlanUpdateManyWithoutUserNestedInput = {
          create: {
            name,
            semesters: semesters,
            requirements: degreeRequirements,
            startYear,
            startSemester,
            endYear,
            endSemester,
          },
        };

        const updatedUser = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: { plans },
          select: {
            plans: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              select: {
                id: true,
              },
            },
          },
        });

        return updatedUser.plans[0].id;
      } catch (error) {
        console.error(error);
      }
    }),
  // Protected route: route uses session user id
  seenHomeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const userInfo = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          seenHomeOnboardingModal: true,
        },
      });
      if (!userInfo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return userInfo;
    } catch {
      console.error('WHY YOU NO WORK');
    }
  }),
  // Protected route: route uses session user id
  seenPlanOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    const userInfo = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        seenPlanOnboardingModal: true,
      },
    });
    if (!userInfo) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return userInfo;
  }),
});

// createNewYear creates a new year like this: 22-> F22, S23, U23
// Thus, to include S23 & U23, you put the year below
const addTemplateCoursesToPlan = ({
  startYear,
  templateData,
}: {
  startYear: number;
  templateData: {
    semester: number;
    items: {
      name: string;
      type: TemplateDataType;
    }[];
  }[];
}): Prisma.SemesterCreateWithoutPlanInput[] => {
  const semesterData: Prisma.SemesterCreateWithoutPlanInput[] = [];

  // Iterate over each year
  for (let i = 0; i < 4; i++) {
    // Create new semesters for the academic year
    const fallSem: Prisma.SemesterCreateWithoutPlanInput = {
      semester: 'f',
      year: startYear + i,
      courses: createCoursesFromTemplate({ items: templateData[i * 2].items }),
      color: '',
    };

    const springSem: Prisma.SemesterCreateWithoutPlanInput = {
      semester: 's',
      year: startYear + i + 1,
      courses: createCoursesFromTemplate({ items: templateData[i * 2 + 1].items }),
      color: '',
    };

    const summerSem: Prisma.SemesterCreateWithoutPlanInput = {
      semester: 'u',
      year: startYear + i + 1,
      courses: createCoursesFromTemplate({ items: [] }),
      color: '',
    };

    const newYear = [fallSem, springSem, summerSem];

    semesterData.push(...newYear);
  }
  return semesterData;
};

const createCoursesForUserPlan = (courses: string[]) => {
  if (courses.length > 0)
    return {
      createMany: {
        data: courses.map((course) => {
          return { code: course, color: '' };
        }),
      },
    };
  else {
    return {
      create: courses.map((course) => {
        return { code: course, color: '' };
      }),
    };
  }
};

const createCoursesFromTemplate = ({
  items,
}: {
  items: { name: string; type: TemplateDataType }[];
}): Prisma.CourseCreateNestedManyWithoutSemesterInput => {
  // Duplicate placeholder courses exist in the template
  // Make them unique by appending an increment at the end
  const duplicateCourses: { [key: string]: number } = {};
  if (items.length > 0) {
    return {
      createMany: {
        data: items.map((item) => {
          if (item.name in duplicateCourses) {
            duplicateCourses[item.name] += 1;
            const code = `${item.name} - ${duplicateCourses[item.name]}`;
            return { code, color: '' };
          }
          duplicateCourses[item.name] = 0;
          return { code: item.name, color: '' };
        }),
      },
    };
  } else {
    return {
      create: [],
    };
  }
};
