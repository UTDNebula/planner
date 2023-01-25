import { Prisma, SemesterCode, SemesterType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ObjectID } from 'bson';
import { z } from 'zod';

import { createNewYear } from '@/utils/utilFunctions';

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
            upsert: {
              update: {
                name: input.name,
              },
              create: {
                name: input.name,
              },
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
        majors: z.array(z.string()).min(1),
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
                majors: input.majors,
              },
              create: {
                name: input.name,
                majors: input.majors,
              },
            },
          },
        },
      });
      console.table(user);
      return user;
    }),
  createEmptyUserPlan: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const planId = new ObjectID().toString();

      // idk how to type this
      const dummySemesterData: Prisma.SemesterCreateInput[] = [
        {
          id: new ObjectID().toString(),
          code: {
            year: 2022,
            semester: 'f' as SemesterType,
          },
          courses: [],
        },
        {
          id: new ObjectID().toString(),
          code: {
            year: 2023,
            semester: 's' as SemesterType,
          },
          courses: [],
        },
        {
          id: new ObjectID().toString(),
          code: {
            year: 2023,
            semester: 'u' as SemesterType,
          },
          courses: [],
        },
      ];
      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: dummySemesterData, // Prepopulate with semester
      };

      const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
        id: planId,
        name: 'test plan',
        semesters: semesters,
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
  createUserPlan: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
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

      // Fetch credits
      const credits = (
        await ctx.prisma.credit.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            courseCode: true,
            semesterCode: true,
            transfer: true,
          },
        })
      ).map((credit) => credit.courseCode);

      const major = template.name;
      const templateData = template.templateData;
      const numOfSemesters = templateData.length;

      // Create semesters
      const semestersInput: { id: string; code: SemesterCode; courses: string[] }[] = [];

      for (let i = 0; i < 4; i++) {
        // Create new year
        createNewYear({ year: 2022 + i, semester: 'u' })
          .map((sem) => {
            return { ...sem, courses: [] as string[], id: sem.id.toString() };
          })
          .map((sem) => semestersInput.push(sem));

        // Add courses to year from both semester templates
        for (let j = 0; j < 2; j++) {
          templateData[j + 2 * i].items.forEach((item) => {
            if (!credits.includes(item.name)) {
              semestersInput[i * 3 + j].courses.push(item.name);
            }
          });
        }
      }

      const semesters: Prisma.SemesterUncheckedCreateNestedManyWithoutPlanInput = {
        create: [...semestersInput],
      };

      const plansInput: Prisma.PlanUncheckedCreateWithoutUserInput = {
        name: major,
        semesters: semesters,
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
          name: true,
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
      console.log('DID YOU FAIL?');
      return updatedUser.plans[0].id;
    } catch (error) {
      console.error(error);
    }
  }),
});
