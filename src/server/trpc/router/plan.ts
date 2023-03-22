import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Semester as PlanSemester } from '@/components/planner/types';
import {
  createNewYear,
  createSemesterCodeRange,
  isSemesterEarlier,
  isSemesterLater,
} from '@/utils/utilFunctions';

import { protectedProcedure, router } from '../trpc';
import { Prisma, SemesterCode, Semester } from '@prisma/client';
import { ObjectId } from 'bson';

export const planRouter = router({
  getUserPlans: protectedProcedure.query(async ({ ctx }) => {
    try {
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
    } catch (error) {}
  }),
  getPlanById: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    try {
      // Fetch current plan
      const planData = await ctx.prisma.plan.findUnique({
        where: {
          id: input,
        },
        select: {
          name: true,
          id: true,
          semesters: {
            include: {
              courses: true,
            },
          },
          transferCredits: true,
        },
      });

      if (!planData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }
      return { plan: planData };
    } catch (error) {
      console.log('ERROR');
      console.log(error);
    }
  }),
  deletePlanById: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    // check if plans belongs to user with id = ctx.session.user.id
    try {
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
    } catch (error) {
      return false;
    }
  }),
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
        select: { semesters: true },
      });

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }

      if (plan.semesters.length > 0) {
        // Delete all semesters outside of the new semester range
        let newSemesters = plan.semesters.filter(
          ({ code }) =>
            !isSemesterEarlier(code, newStartSemester as SemesterCode) &&
            !isSemesterLater(code, newEndSemester as SemesterCode),
        );

        // Prepend semesters if new semester range is earlier than first semester
        const firstSemesterCode = plan.semesters[0].code;
        const lastSemesterCode = plan.semesters[plan.semesters.length - 1].code;
        if (isSemesterEarlier(newStartSemester as SemesterCode, firstSemesterCode)) {
          newSemesters = [
            ...(createSemesterCodeRange(
              newStartSemester as SemesterCode,
              firstSemesterCode,
              false,
              true,
            ).map((semesterCode) => ({
              code: semesterCode,
              color: '',
              planId,
              id: new ObjectId().toString(),
            })) as Semester[]),
            ...newSemesters,
          ];
        }

        // Append semesters if new semester range is later than last semeseter
        if (isSemesterLater(newEndSemester as SemesterCode, lastSemesterCode)) {
          newSemesters = [
            ...newSemesters,
            ...(createSemesterCodeRange(
              lastSemesterCode,
              newEndSemester as SemesterCode,
              true,
              false,
            ).map((semesterCode) => ({
              code: semesterCode,
              color: '',
              planId,
              id: new ObjectId().toString(),
            })) as Semester[]),
          ];
        }

        await ctx.prisma.semester.deleteMany({ where: { planId } });
        await ctx.prisma.semester.createMany({ data: newSemesters });
      }
    }),
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

        const newYear: PlanSemester[] = createNewYear(
          plan.semesters[0] ? plan.semesters[0].code : { semester: 'u', year: 2022 },
        );

        await ctx.prisma.plan.update({
          where: {
            id: planId,
          },
          data: {
            semesters: {
              createMany: {
                data: newYear.map((semester, idx) => {
                  return {
                    ...semester,
                    courses: undefined,
                    id: semesterIds[idx].toString(),
                  };
                }),
              },
            },
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    }),
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
          },
          data: {
            courses: {
              create: [
                {
                  code: courseName,
                  color: '',
                },
              ],
            },
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    }),
  removeCourseFromSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { semesterId, courseName } = input;

        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        await ctx.prisma.course.delete({
          where: {
            semesterId_code: {
              semesterId,
              code: courseName,
            },
          },
        });
        return true;
      } catch (error) {
        console.error(error);
      }
    }),
  deleteAllCoursesFromSemester: protectedProcedure
    .input(z.object({ semesterId: z.string() }))
    .mutation(async ({ ctx, input: { semesterId } }) => {
      await ctx.prisma.course
        .deleteMany({
          where: { semesterId },
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
  validateDegreePlan: protectedProcedure
    .input(
      z.object({
        courses: z.array(
          z.object({
            name: z.string(),
            department: z.string(),
            level: z.number(),
            hours: z.number(),
          }),
        ),
        bypasses: z.array(
          z.object({
            course: z.string(),
            requirement: z.string(),
            hours: z.number(),
          }),
        ),
        degree: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await fetch('http://0.0.0.0:5001/test-validate', {
          method: 'POST',
          body: JSON.stringify(input),
          headers: {
            'content-type': 'application/json',
          },
        }).then(async (res) => {
          const rawData = await res.json();

          return rawData;
          // Transform data
        });
      } catch (error) {
        console.log(error);
      }
    }),
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
        },
        data: {
          color: input.color,
        },
      });
      return true;
    }),
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
          id: input.semesterId,
        },
        data: {
          locked: input.locked,
        },
      });
      return true;
    }),
  addBypass: protectedProcedure
    .input(z.object({ planId: z.string(), requirement: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, requirement } = input;

        const degreeRequirements = await ctx.prisma.degreeRequirements.findUnique({
          where: {
            planId,
          },
          select: {
            bypasses: true,
            id: true,
          },
        });

        if (!degreeRequirements) {
          throw 'No degree requirements';
        }

        const bypasses = [...degreeRequirements.bypasses, requirement];

        const updatedDegreeRequirements = await ctx.prisma.degreeRequirements.update({
          where: {
            id: degreeRequirements.id,
          },
          data: {
            bypasses,
          },
        });

        return true;
      } catch (e) {
        console.error(e);
      }
    }),

  removeBypass: protectedProcedure
    .input(z.object({ planId: z.string(), requirement: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, requirement } = input;

        const degreeRequirements = await ctx.prisma.degreeRequirements.findUnique({
          where: {
            planId,
          },
          select: {
            bypasses: true,
            id: true,
          },
        });

        if (!degreeRequirements) {
          throw 'No degree requirements';
        }

        // Create NewBypass if it doesn't exist
        if (degreeRequirements.bypasses === null) {
          throw 'No bypass';
        }

        // If we know the bypass model exists, we can update it directly
        const newBypass = await ctx.prisma.degreeRequirements.update({
          where: {
            id: degreeRequirements.id, // Null-assertion bc type narrowing is being dumb here
          },
          data: {
            bypasses: [...degreeRequirements.bypasses.filter((id) => id !== requirement)].sort(),
          },
        });

        return newBypass.id;
      } catch {}
    }),
  getBypasses: protectedProcedure.input(z.object({})).query(async ({ ctx, input }) => {
    try {
    } catch {}
  }),
  getDegreeRequirements: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { planId } = input;

        const degreeRequirements = await ctx.prisma.degreeRequirements.findUnique({
          where: {
            planId,
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
  updatePlanTitle: protectedProcedure
    .input(z.object({ planId: z.string(), title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, title } = input;
        await ctx.prisma.plan.update({
          where: {
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
  updatePlanMajor: protectedProcedure
    .input(z.object({ planId: z.string(), major: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { planId, major } = input;
        await ctx.prisma.degreeRequirements.update({
          where: {
            planId,
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
