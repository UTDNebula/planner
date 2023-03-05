import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ObjectID } from 'bson';
import { z } from 'zod';

import { createNewYear, isSemCodeEqual } from '@/utils/utilFunctions';

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
      const startYear =
        startSemester?.semester === 'f' ? startSemester.year : startSemester.year - 1;

      const endYear = endSemester?.semester === 'f' ? endSemester.year + 1 : endSemester.year;

      const semesterData: Prisma.SemesterCreateInput[] = [];

      // createNewYear creates a new year like this: 22-> F22, S23, U23
      // Thus, to include S23 & U23, you put the year below
      for (let i = startYear; i < endYear; i++) {
        semesterData.push(
          ...createNewYear({ semester: 'f', year: i }).map((sem) => {
            // Add credits to each semester
            const courses: string[] = [];

            for (const course of takenCourses) {
              if (isSemCodeEqual(course.semesterCode, sem.code)) {
                courses.push(course.courseCode);
              }
            }

            return {
              ...sem,
              id: sem.id.toString(),
              courses: { create: courses.map((course) => ({ code: course, color: '' })) },
            };
          }),
        );
      }

      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: semesterData, // Prepopulate with semester
      };

      const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
        id: planId,
        name: name,
        semesters: semesters,
        requirements: degreeRequirements,
        transferCredits,
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
                return {
                  ...sem,
                  id: sem.id.toString(),
                  courses: { create: courses.map((course) => ({ code: course, color: '' })) },
                };
              }
              templateData[i - startYear + counter].items.map((course) => {
                const countOfCoursesWithSameCode = courses.reduce(
                  (count, curr) => count + (course.name == curr ? 1 : 0),
                  0,
                );
                if (countOfCoursesWithSameCode > 0) {
                  courses.push(`${course.name} ${countOfCoursesWithSameCode}`);
                } else {
                  courses.push(course.name);
                }
              });
              counter++;
              return {
                ...sem,
                id: sem.id.toString(),
                courses: { create: courses.map((course) => ({ code: course, color: '' })) },
              };
            }),
          );
        }

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
