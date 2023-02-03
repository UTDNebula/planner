import { Bypass, Prisma, Semester, SemesterCode, SemesterType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ObjectID } from 'bson';
import { z } from 'zod';

import { createNewYear, createSemesterCodeRange } from '@/utils/utilFunctions';

import { protectedProcedure, router } from '../trpc';

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
  updateUserProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
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
        credits: z.array(
          z.object({
            courseCode: z.string(),
            semesterCode: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
            transfer: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (input.credits.length > 0) {
        await ctx.prisma.credit.createMany({
          data: input.credits.map((credit) => {
            return { ...credit, userId: userId };
          }),
        });
      }

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
   *  - takes in plan name, major, start & end semesters, and whether or not to sync credits
   */
  createUserPlan: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const planId = new ObjectID().toString();

    // Create degree requirements
    const degreeRequirements: Prisma.DegreeRequirementsUncheckedCreateNestedOneWithoutPlanInput = {
      create: {
        major: 'Computer Science(BS)', // Hardcode for now
      },
    };

    const user = await ctx.prisma.user.findFirst({
      where: { id: userId },
      select: {
        profile: true,
      },
    });

    // Fetch credits; will add to semesters later
    const creditsData = await ctx.prisma.credit.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        courseCode: true,
        semesterCode: true,
      },
    });

    // Create # semesters based on user's starting & ending semester
    const startSemester = user?.profile?.startSemester ?? {
      semester: 'f',
      year: new Date().getMonth() > 7 ? new Date().getFullYear() : new Date().getFullYear() - 1,
    };
    const endSemester = user?.profile?.endSemester ?? {
      semester: 's',
      year: startSemester.year + 4,
    };

    // Since we display plans by year, we need to determine what the start & end year is via some annoying logic
    const startYear = startSemester?.semester === 'f' ? startSemester.year : startSemester.year - 1;

    const endYear = endSemester?.semester === 'f' ? endSemester.year + 1 : endSemester.year;

    const semesterData: Prisma.SemesterCreateInput[] = [];

    // createNewYear creates a new year like this: 22-> F22, S23, U23
    // Thus, to include S23 & U23, you put the year below
    for (let i = startYear; i < endYear; i++) {
      semesterData.push(
        ...createNewYear({ semester: 'f', year: i }).map((sem) => {
          // Add credits to each semester
          const courses: string[] = [];
          creditsData.map((credit) => {
            if (
              credit.semesterCode.semester === sem.code.semester &&
              credit.semesterCode.year === sem.code.year
            ) {
              courses.push(credit.courseCode);
            }
          });
          return { ...sem, id: sem.id.toString(), courses: courses };
        }),
      );
    }

    const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
      create: semesterData, // Prepopulate with semester
    };

    const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
      id: planId,
      name: 'test plan',
      semesters: semesters,
      requirements: degreeRequirements,
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
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      console.info('CRI');
      const userId = ctx.session.user.id;
      try {
        const template = await ctx.prisma.template.findUnique({
          where: {
            id: input,
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

        const major = template.name;
        const templateData = template.templateData;

        // Get user info
        const user = await ctx.prisma.user.findFirst({
          where: { id: userId },
          select: {
            profile: true,
          },
        });

        // Create # semesters based on user's starting semester
        const startSemester = user?.profile?.startSemester ?? {
          semester: 'f',
          year: new Date().getMonth() > 7 ? new Date().getFullYear() : new Date().getFullYear() - 1,
        };

        // Since we display plans by year, we need to determine what the start & end year is via some annoying logic
        const startYear =
          startSemester?.semester === 'f' ? startSemester.year : startSemester.year - 1;

        const semesterData: Prisma.SemesterCreateInput[] = [];

        // createNewYear creates a new year like this: 22-> F22, S23, U23
        // Thus, to include S23 & U23, you put the year below
        for (let i = startYear; i < startYear + 4; i++) {
          // We use counter to ensure that we access templateData 0-7
          // B/c semesterData goes from 0-11
          let counter = 0;
          semesterData.push(
            ...createNewYear({ semester: 'f', year: i }).map((sem, idx) => {
              // Add credits to each semester
              const courses: string[] = [];
              if (idx % 3 === 2) {
                return { ...sem, id: sem.id.toString(), courses: courses };
              }
              templateData[i - startYear + counter].items.map((course) => {
                courses.push(course.name);
              });
              counter++;
              return { ...sem, id: sem.id.toString(), courses: courses };
            }),
          );
        }

        const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
          create: semesterData, // Prepopulate with semester
        };

        // Create degree requirements
        const degreeRequirements: Prisma.DegreeRequirementsUncheckedCreateNestedOneWithoutPlanInput =
          {
            create: {
              major,
            },
          };

        const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
          name: major,
          semesters: semesters,
          requirements: degreeRequirements,
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
      } catch (error) {
        console.error(error);
      }
    }),
});
