import { Prisma, Semester } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { Semester as PlanSemester } from '@/components/planner/types';
import {
  createYearBasedOnFall,
  createSemesterCodeRange,
  isEarlierSemester,
} from '@/utils/utilFunctions';
import { SemesterCode, computeSemesterCode } from 'prisma/utils';

import { protectedProcedure, router } from '../trpc';

export const planRouter = router({
  // Protected route: route uses session user id to find user plans
  getUserPlans: protectedProcedure.query(async ({ ctx }) => {
    const plans = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        plans: {
          select: {
            name: true,
            requirements: true,
            id: true,
          },
        },
      },
    });

    return plans;
  }),
  // Protected route: checks if session user and plan owner have the same id
  getPlanById: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    // Fetch current plan
    const planData = await ctx.prisma.plan.findUnique({
      where: {
        id: input,
      },
      select: {
        name: true,
        id: true,
        userId: true,
        semesters: {
          include: {
            courses: true,
          },
        },
        transferCredits: true,
      },
    });

    // Make sure semesters are in right orer
    if (planData && planData.semesters) {
      planData.semesters = planData.semesters.sort((a, b) =>
        isEarlierSemester(computeSemesterCode(a), computeSemesterCode(b)) ? -1 : 1,
      );
    }

    if (!planData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Plan not found',
      });
    }

    if (ctx.session.user.id !== planData.userId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return { plan: { ...planData, semesters: planData.semesters.map(computeSemesterCode) } };
  }),
  // Protected route: route uses session user id
  deletePlanById: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    // check if plans belongs to user with id = ctx.session.user.id
    const planData = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        plans: {
          where: {
            id: input,
          },
          select: {
            id: true,
          },
        },
      },
    });
    const plan = planData?.plans[0];
    await ctx.prisma.plan.delete({
      where: {
        id: plan?.id,
      },
    });
    return true;
  }),
  // Protected route: checks if session user and plan owner have the same id
  modifySemesters: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        newStartSemester: z.object({
          semester: z.string(),
          year: z.number(),
        }),
        newEndSemester: z.object({
          semester: z.string(),
          year: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input: { planId, newStartSemester, newEndSemester } }) => {
      const plan = await ctx.prisma.plan.findUnique({
        where: { id: planId },
        select: { semesters: true, userId: true },
      });

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }

      if (ctx.session.user.id !== plan.userId) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Since we're deleting things anyway, we can just create new xD
      const newSems = createSemesterCodeRange(
        newStartSemester as SemesterCode,
        newEndSemester as SemesterCode,
        true,
        true,
      ).map(({ year, semester }) => ({
        color: '',
        planId,
        id: uuidv4(),
        year,
        semester,
      })) as Semester[];

      await ctx.prisma.semester.deleteMany({ where: { planId } });
      await ctx.prisma.semester.createMany({ data: newSems });
    }),
  // Protected route: route uses session user id
  deleteYear: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    try {
      const semesterIds = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          plans: {
            where: {
              id: input,
            },
            select: {
              semesters: {
                select: {
                  id: true,
                },
                take: -3,
              },
            },
          },
        },
      });
      await ctx.prisma.semester.deleteMany({
        where: {
          id: { in: semesterIds?.plans[0].semesters.map((val) => val.id) },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }),
  // Protected route: checks if session user and plan owner have the same id
  addYear: protectedProcedure
    .input(z.object({ planId: z.string(), semesterIds: z.array(z.string()).length(3) }))
    .mutation(async ({ ctx, input }) => {
      const { planId, semesterIds } = input;
      try {
        const plan = await ctx.prisma.plan.findUnique({
          where: {
            id: planId,
          },
          select: {
            userId: true,
            semesters: {
              take: -1,
            },
          },
        });

        if (!plan) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plan not found',
          });
        }

        if (ctx.session.user.id !== plan.userId) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        const newYear: PlanSemester[] = createYearBasedOnFall(
          computeSemesterCode(plan.semesters[0] ?? { semester: 'u', year: 2022 }).year,
        );

        await ctx.prisma.plan.update({
          where: {
            id: planId,
          },
          data: {
            semesters: {
              createMany: {
                data: newYear.map((semester, idx) => {
                  // !TODO change this wtf
                  return {
                    courses: undefined,
                    semester: semester.code.semester,
                    year: semester.code.year,
                    id: semesterIds[idx].toString(),
                  };
                }),
              },
            },
          },
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  // Protected route: route uses session user id
  addCourseToSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get semester you're adding the course to
      try {
        const { semesterId, courseName } = input;

        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: semesterId,
            plan: { userId: ctx.session.user.id },
          },
          data: {
            courses: {
              create: { code: courseName, color: '' },
            },
          },
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  // Protected route: route uses session user id
  removeCourseFromSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { semesterId, courseName } = input;

        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        await ctx.prisma.course.delete({
          where: {
            semester: { plan: { userId: ctx.session.user.id } },
            semesterId_code: {
              semesterId,
              code: courseName,
            },
          },
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  massInsertCourses: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          code: z.string(),
          color: z.string().default(''),
          semesterId: z.string(),
          locked: z.boolean(),
          prereqOverriden: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.course.createMany({ data: input });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }),
  massDeleteCourses: protectedProcedure
    .input(z.object({ courseIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.course.deleteMany({
          where: {
            id: { in: input.courseIds },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: error,
          message: 'Faild to mass delete courses: ' + error,
        });
      }
    }),
  // Protected route: route uses session user id
  deleteAllCoursesFromSemester: protectedProcedure
    .input(z.object({ semesterId: z.string() }))
    .mutation(async ({ ctx, input: { semesterId } }) => {
      const semester = await ctx.prisma.semester.findUnique({
        where: {
          id: semesterId,
          plan: { userId: ctx.session.user.id },
        },
        include: {
          courses: true,
        },
      });
      if (!semester) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Semester does not exist',
        });
      }
      const unlockedCourses = semester?.courses.filter((course) => !course.locked);
      await ctx.prisma.course
        .deleteMany({
          where: { semesterId, id: { in: unlockedCourses.map((course) => course.id) } },
        })
        .catch((err) => {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Semester does not exist',
              });
            }
          }
        });
    }),
  // Protected route: route uses session user id
  moveCourseFromSemester: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        oldSemesterId: z.string(),
        newSemesterId: z.string(),
        courseName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { oldSemesterId, newSemesterId, courseName } = input;

        await ctx.prisma.course.update({
          where: {
            semester: { plan: { userId: ctx.session.user.id } },
            semesterId_code: {
              semesterId: oldSemesterId,
              code: courseName,
            },
          },
          data: {
            semesterId: newSemesterId,
          },
        });
        return true;
      } catch (error) {
        console.error(error);
      }
    }),
  // Protected route: route uses session user id
  changeSemesterColor: protectedProcedure
    .input(
      z.object({
        semesterId: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.update({
        where: {
          id: input.semesterId,
          plan: { userId: ctx.session.user.id },
        },
        data: {
          color: input.color,
        },
      });
      return true;
    }),
  // Protected route: route uses session user id
  changeCourseColor: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        semesterId: z.string(),
        courseName: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.update({
        where: {
          semester: { plan: { userId: ctx.session.user.id } },
          semesterId_code: {
            semesterId: input.semesterId,
            code: input.courseName,
          },
        },
        data: {
          color: input.color,
        },
      });
      return true;
    }),
  // Protected route: route uses session user id
  changeCoursePrereqOverride: protectedProcedure
    .input(
      z.object({
        semesterId: z.string(),
        courseName: z.string(),
        prereqOverriden: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.update({
        where: {
          semester: { plan: { userId: ctx.session.user.id } },
          semesterId_code: {
            semesterId: input.semesterId,
            code: input.courseName,
          },
        },
        data: {
          prereqOverriden: input.prereqOverriden,
        },
      });
      return true;
    }),
  // Protected route: route uses session user id
  changeCourseLock: protectedProcedure
    .input(
      z.object({
        semesterId: z.string(),
        courseName: z.string(),
        locked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.update({
        where: {
          semester: { plan: { userId: ctx.session.user.id } },
          semesterId_code: {
            semesterId: input.semesterId,
            code: input.courseName,
          },
        },
        data: {
          locked: input.locked,
        },
      });
      return true;
    }),
  // Protected route: route uses session user id
  changeSemesterLock: protectedProcedure
    .input(
      z.object({
        semesterId: z.string(),
        locked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.update({
        where: {
          plan: { userId: ctx.session.user.id },
          id: input.semesterId,
        },
        data: {
          locked: input.locked,
        },
      });
      return true;
    }),
  // Protected route: route uses session user id
  addBypass: protectedProcedure
    .input(z.object({ planId: z.string(), requirement: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, requirement } = input;

        const degreeRequirements = await ctx.prisma.degreeRequirements.findFirstOrThrow({
          where: {
            plan: { userId: ctx.session.user.id, id: planId },
          },
          select: {
            bypasses: true,
            id: true,
          },
        });

        const bypasses = [...degreeRequirements.bypasses, requirement];

        //update degree plan requirements
        await ctx.prisma.degreeRequirements.update({
          where: {
            plan: { userId: ctx.session.user.id },
            id: degreeRequirements.id,
          },
          data: {
            bypasses,
          },
        });

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }),
  // Protected route: route uses session user id
  removeBypass: protectedProcedure
    .input(z.object({ planId: z.string(), requirement: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, requirement } = input;

        const degreeRequirements = await ctx.prisma.degreeRequirements.findFirstOrThrow({
          where: {
            plan: { userId: ctx.session.user.id, id: planId },
          },
          select: {
            bypasses: true,
            id: true,
          },
        });

        // Create NewBypass if it doesn't exist
        if (degreeRequirements.bypasses === null) {
          throw 'No bypass';
        }

        // If we know the bypass model exists, we can update it directly
        const newBypass = await ctx.prisma.degreeRequirements.update({
          where: {
            plan: { userId: ctx.session.user.id },
            id: degreeRequirements.id, // Null-assertion bc type narrowing is being dumb here
          },
          data: {
            bypasses: [...degreeRequirements.bypasses.filter((id) => id !== requirement)].sort(),
          },
        });

        return newBypass.id;
      } catch {}
    }),
  // Protected route: route uses session user id
  getDegreeRequirements: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { planId } = input;

        const degreeRequirements = await ctx.prisma.degreeRequirements.findFirst({
          where: {
            plan: { userId: ctx.session.user.id, id: planId },
          },
          select: {
            major: true,
            id: true,
          },
        });

        if (!degreeRequirements) {
          throw 'No degree requirements';
        }

        return degreeRequirements;
      } catch {}
    }),
  // Protected route: route uses session user id
  updatePlanTitle: protectedProcedure
    .input(z.object({ planId: z.string(), title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, title } = input;
        await ctx.prisma.plan.update({
          where: {
            userId: ctx.session.user.id,
            id: planId,
          },
          data: {
            name: title,
          },
        });
        return true;
      } catch {
        return false;
      }
    }),
  // Protected route: route uses session user id
  updatePlanMajor: protectedProcedure
    .input(
      z.object({
        degreeRequirementsId: z.string().min(1),
        planId: z.string().min(1),
        major: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, major, degreeRequirementsId } = input;

        await ctx.prisma.degreeRequirements.update({
          where: {
            id: degreeRequirementsId,
            plan: { userId: ctx.session.user.id, id: planId },
          },
          data: {
            major,
          },
        });
        return true;
      } catch {
        return false;
      }
    }),
});
