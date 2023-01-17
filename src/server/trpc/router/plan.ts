import { DegreeRequirementGroup, Semester } from '@/components/planner/types';
import { formatDegreeValidationRequest } from '@/utils/plannerUtils';

import { createNewYear } from '@/utils/utilFunctions';
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
              name: true,
              id: true,
              semesters: {
                select: {
                  id: true,
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

      const body = formatDegreeValidationRequest(planData.plans[0].semesters);

      const validationData = await fetch('http://127.0.0.1:5000/validate-degree-plan', {
        method: 'POST',
        body: JSON.stringify(body),
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

      return { plan: planData.plans[0], validation: validationData };
    } catch (error) {
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
      console.log('A');
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

        const newYear: Semester[] = createNewYear(
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
                    courses: semester.courses.map((course) => course.code),
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
