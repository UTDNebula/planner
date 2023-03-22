import { Prisma, SemesterCode, SemesterType, TemplateDataType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ObjectID } from 'bson';
import { z } from 'zod';

import { createNewSemesterCode, isSemCodeEqual } from '@/utils/utilFunctions';

import { protectedProcedure, router } from '../trpc';
import { isEarlierSemester } from '@/utils/plannerUtils';

export const userRouter = router({
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

    return userInfo;
  }),
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.prisma.user.delete({ where: { id: userId } });
  }),
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
              startSemester: input.startSemester,
              endSemester: input.endSemester,
            },
          },
        },
      });
      console.table(user);
      return user;
    }),
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
                startSemester: input.startSemester,
                endSemester: input.endSemester,
              },
              create: {
                name: input.name,
                startSemester: input.startSemester,
                endSemester: input.endSemester,
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
      const planId = new ObjectID().toString();

      const { name, major, takenCourses, transferCredits } = input;
      const bypasses: string[] = [];

      // Create degree requirements
      const degreeRequirements: Prisma.DegreeRequirementsUncheckedCreateNestedOneWithoutPlanInput =
        {
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

      const { startSemester: userStartSemester, endSemester: userEndSemester } = user.profile;

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
      const semesterData: Prisma.SemesterCreateInput[] = [];

      // Create semesters and add courses from transcript to each semester
      while (isEarlierSemester(currSem, endSemester) || isSemCodeEqual(currSem, endSemester)) {
        // Create new semester

        const courses: string[] = [];

        for (const course of takenCourses) {
          if (isSemCodeEqual(course.semesterCode, currSem)) {
            courses.push(course.courseCode);
          }
        }

        const newSem: Prisma.SemesterCreateInput = {
          code: currSem,
          color: '',
          courses: createCoursesForUserPlan(courses),
        };

        semesterData.push(newSem);

        currSem = createNewSemesterCode(currSem);
      }

      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: semesterData,
      };

      const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
        id: planId,
        name: name,
        semesters: semesters,
        requirements: degreeRequirements,
        transferCredits,
        startSemester,
        endSemester,
      };

      const plans: Prisma.PlanUpdateManyWithoutUserNestedInput = {
        create: plansInput,
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
   * Duplicates a user plan based on an existing one
   *  - Takes in id, major
   */
  duplicateUserPlan: protectedProcedure
    .input(z.object({ id: z.string(), major: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const planId = new ObjectID().toString();

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
      const degreeRequirements: Prisma.DegreeRequirementsUncheckedCreateNestedOneWithoutPlanInput =
        {
          create: {
            major, // Hardcode for now
          },
        };

      // Create semesters based on existing plan
      const semesterData: Prisma.SemesterCreateInput[] = [];

      // Push existing semester data to new plan
      for (let i = 0; i < plan!.semesters.length; i++) {
        const courses = {
          create: plan!.semesters[i].courses.map((course) => {
            return { code: course.code, color: course.color };
          }),
        };

        const semData = {
          courses,
          code: plan!.semesters[i].code,
          color: plan!.semesters[i].color,
        };
        semesterData.push(semData);
      }

      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: semesterData, // Prepopulate with semester
      };

      const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
        id: planId,
        name: 'Copy-' + plan!.name,
        semesters: semesters,
        requirements: degreeRequirements,
        endSemester: plan!.endSemester,
        startSemester: plan!.startSemester,
      };

      const plans: Prisma.PlanUpdateManyWithoutUserNestedInput = {
        create: plansInput,
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
  createTemplateUserPlan: protectedProcedure
    .input(z.object({ name: z.string(), templateName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name, templateName } = input;
      const userId = ctx.session.user.id;
      try {
        const template = await ctx.prisma.template.findUnique({
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

        const { startSemester, endSemester } = getStartingAndEndingSemesters(
          user.profile.startSemester,
        );

        // Add template courses to semesters
        const semesterData = addTemplateCoursesToPlan({
          startYear: startSemester.year,
          templateData,
        });

        const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
          create: semesterData, // Prepopulate with semester
        };

        const bypasses: string[] = [];

        // Create degree requirements
        const degreeRequirements: Prisma.DegreeRequirementsUncheckedCreateNestedOneWithoutPlanInput =
          {
            create: {
              major,
              bypasses,
            },
          };

        const plansInput = {
          name,
          semesters: semesters,
          requirements: degreeRequirements,
          startSemester,
          endSemester,
        };

        const updatedUser = await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            plans: {
              create: plansInput,
            },
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
      } catch (error) {
        console.log('HELP');
        console.error(error);
      }
    }),
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

      console.log(userInfo);
      return userInfo;
    } catch {
      console.error('WHY YOU NO WORK');
    }
  }),
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
}): Prisma.SemesterCreateInput[] => {
  const semesterData: Prisma.SemesterCreateInput[] = [];

  // Iterate over each year
  for (let i = 0; i < 4; i++) {
    // Create new semesters for the academic year
    const fallSem: Prisma.SemesterCreateInput = {
      code: { semester: 'f', year: startYear + i },
      courses: createCoursesFromTemplate({ items: templateData[i * 2].items }),
      color: '',
    };

    const springSem = {
      code: { semester: 's' as SemesterType, year: startYear + i + 1 },
      courses: createCoursesFromTemplate({ items: templateData[i * 2 + 1].items }),
      color: '',
    };

    const summerSem = {
      code: { semester: 'u' as SemesterType, year: startYear + i + 1 },
      courses: createCoursesFromTemplate({ items: [] }),
      color: '',
    };

    const newYear = [fallSem, springSem, summerSem];

    semesterData.push(...newYear);
  }
  return semesterData;
};

const createCoursesForUserPlan = (courses: string[]) => {
  return {
    create: courses.map((course) => {
      return { code: course, color: '' };
    }),
  };
};

const createCoursesFromTemplate = ({
  items,
}: {
  items: { name: string; type: TemplateDataType }[];
}): Prisma.CourseCreateNestedManyWithoutSemesterInput => {
  // Duplicate placeholder courses exist in the template
  // Make them unique by appending an increment at the end
  const duplicateCourses: { [key: string]: number } = {};
  return {
    create: items.map((item) => {
      if (item.name in duplicateCourses) {
        duplicateCourses[item.name] += 1;
        const code = `${item.name} - ${duplicateCourses[item.name]}`;
        return { code, color: '' };
      }
      duplicateCourses[item.name] = 0;
      return { code: item.name, color: '' };
    }),
  };
};

const getStartingAndEndingSemesters = (userStartSemester: SemesterCode) => {
  // For template plans, always add courses to Fall of whatever year they start with
  const startYear =
    userStartSemester.semester === 'f' ? userStartSemester.year : userStartSemester.year - 1;

  // Define start and end semesters here

  const startSemester: SemesterCode = { semester: 'f', year: startYear };
  const endSemester: SemesterCode = { semester: 'u', year: startYear + 4 };

  return { startSemester, endSemester };
};
