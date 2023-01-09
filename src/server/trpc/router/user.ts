import { getAllCourses } from '@modules/common/api/templates';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure,router } from '../trpc';

export const userRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userInfo = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        onboardingComplete: true,
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
  updateUserOnboard: protectedProcedure
    .input(
      z.object({
        classification: z.string().min(1),
        disclaimer: z.boolean(),
        personalization: z.boolean(),
        analytics: z.boolean(),
        performance: z.boolean(),
        preferredName: z.string().min(1),
        majors: z.array(z.string()).min(1),
        onCampus: z.boolean(),
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
              create: {
                name: input.preferredName,
                disclaimer: input.disclaimer,
                personalization: input.personalization,
                analytics: input.analytics,
                performance: input.performance,
                classification: input.classification,
                majors: input.majors,
              },
              update: {
                name: input.preferredName,
                disclaimer: input.disclaimer,
                personalization: input.personalization,
                analytics: input.analytics,
                performance: input.performance,
                classification: input.classification,
                majors: input.majors,
              },
            },
          },
        },
      });
      console.table(user);
      return user;
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
      const major = template.name;
      // TODO: Handle empty template creation.
      // TODO: Create dummy empty plan
      //
      // if (major === 'empty') {
      //   const createUserPlan = ctx.prisma.user.update({
      //     where: {
      //       id: userId,
      //     },
      //     data: {
      //       plans: {
      //         name: 'My Plan',
      //         semesters: {
      //           create: [
      //             {
      //               name: 'Fall 2022',
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   });
      // }

      const allCourses = await getAllCourses();
      const templateData = template.templateData;

      const numOfSemesters = templateData.length;
      // const creditSemesters: Semester[] = [];

      // TODO: Add course data from credits
      //
      // coursesFromCredits.sort((a, b) => {
      //   if (!a.semester || !b.semester) return;
      //   if (a.semester.year === b.semester.year) {
      //     return semMap[b.semester.semester] < semMap[a.semester.semester] ? -1 : 1;
      //   }
      //   return a.semester.year - b.semester.year;
      // });

      // coursesFromCredits.forEach((course) => {
      //   const { name: title, description, hours, prerequisites } = courses[course.utdCourseCode];

      //   const creditCourse: Course = {
      //     id: uuid(),
      //     title,
      //     catalogCode: course.utdCourseCode,
      //     description,
      //     creditHours: +hours,
      //     prerequisites: prerequisites[0],
      //     validation: { isValid: true, override: false },
      //   };

      //   if (!course.semester) {
      //     const semester = creditSemesters.find((sem) => sem.code === 'transfer');
      //     if (semester) {
      //       semester.courses.push(creditCourse);
      //     } else {
      //       creditSemesters.push({
      //         code: 'transfer',
      //         title: 'Transfer Credits',
      //         courses: [creditCourse],
      //       });
      //     }
      //   } else {
      //     const semester = creditSemesters.find(
      //       (sem) => sem.code === course.semester.year + course.semester.semester,
      //     );
      //     if (semester) {
      //       semester.courses.push(creditCourse);
      //     } else {
      //       creditSemesters.push({
      //         code: course.semester.year + course.semester.semester,
      //         title: semMap[course.semester.semester] + ' ' + course.semester.year,
      //         courses: [creditCourse],
      //       });
      //     }
      //   }
      // });

      const year = new Date().getFullYear();
      let season = 'Fall';
      const semestersInput: Array<Prisma.SemesterUncheckedCreateWithoutPlanInput> = [];
      for (let i = 0; i < numOfSemesters; i++) {
        const sem = templateData[i];

        const coursesInput: Array<Prisma.CourseCreateManySemesterInput> = [];
        const semTitle = `${season} ${year + Math.floor((i + 1) / 2)}`;
        const semCode = `${year + Math.floor((i + 1) / 2)}${season[0].toLowerCase()}`;
        season = season === 'Fall' ? 'Spring' : 'Fall';

        for (let j = 0; j < sem.items.length; j++) {
          let courseInputData: Prisma.CourseCreateManySemesterInput;
          if (sem.items[j].type === 'OPTIONAL') {
            courseInputData = {
              name: sem.items[j].name,
              creditHours: 3,
              description: `Chose one of the ${sem.items[j].name} for this`,
              catalogCode: '',
            };
          } else {
            try {
              const { name: title, description, hours } = allCourses[sem.items[j].name];
              courseInputData = {
                name: title,
                catalogCode: sem.items[j].name,
                description: description,
                creditHours: +hours,
              };
            } catch (e) {
              // TODO: Handle this better, preferably move to server and use a logger
              continue;
            }
          }
          coursesInput.push(courseInputData);
        }

        const courses: Prisma.CourseUncheckedCreateNestedManyWithoutSemesterInput = {
          createMany: {
            data: coursesInput,
          },
        };
        const semesterInputData: Prisma.SemesterUncheckedCreateWithoutPlanInput = {
          name: semTitle,
          code: semCode,
          courses: courses,
        };
        semestersInput.push(semesterInputData);
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
      return updatedUser.plans[0].id;
    } catch (error) {
      console.error(error);
    }
  }),
});
