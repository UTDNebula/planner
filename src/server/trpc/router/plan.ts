import { DegreeRequirement, DegreeRequirementGroup } from '@/components/planner/types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

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
              id: true,
            },
          },
        },
      });
      return plans;
    } catch (error) {}
  }),
  getPlanById: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
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
            name: true,
            id: true,
            semesters: {
              select: {
                id: true,
                name: true,
                code: true,
                courses: true,
              },
            },
          },
        },
      },
    });
    if (!planData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Plan not found',
      });
    }
    return planData.plans[0];
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
  deleteSemester: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    try {
      const semesterId = await ctx.prisma.user.findUnique({
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
              semesters: {
                select: {
                  id: true,
                },
                take: -1,
              },
            },
          },
        },
      });
      await ctx.prisma.semester.delete({
        where: {
          id: semesterId?.plans[0]?.semesters[0]?.id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }),
  addEmptySemesterToPlan: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { planId, semesterId } = input;
      try {
        const plan = await ctx.prisma.plan.findUnique({
          where: {
            id: planId,
          },
          select: {
            semesters: {
              select: {
                code: true,
                name: true,
              },
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
        const lastSemesterCode = plan.semesters[0]?.code ? plan.semesters[0]?.code : '2023s';
        let year = lastSemesterCode?.substring(0, 4);
        let season = lastSemesterCode?.substring(4, 5);
        year = season === 'f' ? (parseInt(year) + 1).toString() : year;
        season = season === 'f' ? 's' : 'f';

        const semTitle = `${season === 'f' ? 'Fall' : 'Spring'} ${year}`;
        const semCode = `${year}${season[0].toLowerCase()}`;

        await ctx.prisma.plan.update({
          where: {
            id: planId,
          },
          data: {
            semesters: {
              create: {
                id: semesterId,
                code: semCode,
                name: semTitle,
                courses: [],
              },
            },
          },
        });
        return true;
      } catch (error) {}
    }),
  addCourseToSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get semester you're adding the course to
      try {
        const { semesterId, courseName } = input;
        console.log(semesterId);
        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const semester = await ctx.prisma.semester.findUnique({
          where: { id: semesterId },
          select: {
            id: true,
            courses: true,
          },
        });

        console.log('HI');
        console.log(semester);
        console.log('HM');
        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: semesterId,
          },
          data: {
            courses: [...semester!.courses, courseName],
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

        console.log(semesterId);
        console.log(courseName);
        console.log('HM');

        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const semester = await ctx.prisma.semester.findUnique({
          where: { id: semesterId },
          select: {
            id: true,
            courses: true,
          },
        });
        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: semesterId,
          },
          data: {
            courses: semester!.courses.filter((cName) => cName != courseName),
          },
        });
        return true;
      } catch (error) {
        console.error(error);
      }
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

        // This works bc semesters are stored in its own table

        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const oldSemester = await ctx.prisma.semester.findUnique({
          where: { id: oldSemesterId },
          select: {
            id: true,
            courses: true,
          },
        });

        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: oldSemesterId,
          },
          data: {
            courses: oldSemester!.courses.filter((cName) => cName != courseName),
          },
        });

        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const semester = await ctx.prisma.semester.findUnique({
          where: { id: newSemesterId },
          select: {
            id: true,
            courses: true,
          },
        });
        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: newSemesterId,
          },
          data: {
            courses: [...semester!.courses, courseName],
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
        return await fetch('http://127.0.0.1:5000/validate-degree-plan', {
          method: 'POST',
          body: JSON.stringify(input),
          headers: {
            'content-type': 'application/json',
          },
        }).then(async (res) => {
          const rawData = await res.json();
          // Transform data
          const core: DegreeRequirementGroup = { name: 'Core Requirements', requirements: [] };
          const major: DegreeRequirementGroup = { name: 'Major Requirements', requirements: [] };
          const electives: DegreeRequirementGroup = {
            name: 'Free Elective Requirements',
            requirements: [],
          };
          const university: DegreeRequirementGroup = {
            name: 'University Requirements',
            requirements: [],
          };

          Object.keys(rawData).forEach((req: string) => {
            if (req.includes('Free Electives')) {
              electives.requirements.push({ name: req, ...rawData[req] });
            } else if (req.includes('Core - ')) {
              core.requirements.push({ name: req, ...rawData[req] });
            } else if ('Minimum Cumulative Hours Upper Level Hour Requirement'.includes(req)) {
              university.requirements.push({ name: req, ...rawData[req] });
            } else {
              major.requirements.push({ name: req, ...rawData[req] });
            }
          });
          return [core, major, electives, university];
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
