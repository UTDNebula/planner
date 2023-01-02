import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  Prisma,
  type User,
  type Plan,
  type Profile,
  type Semester,
  type Course,
  type Template,
} from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { router, protectedProcedure } from '../trpc';
import { getAllCourses } from '@modules/common/api/templates';

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
            },
          },
        },
      });
      return plans;
    } catch (error) {}
  }),
  createUserPlan: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    console.log('Inside createUserPlan');
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
      // if (major === 'empty') {
      //   const newPlan: StudentPlan = { ...dummyPlan, id: uuid() };
      //   dispatch(updatePlan(newPlan));
      //   return router.push(`/app/plans/${newPlan.id}`);
      // }

      const allCourses = await getAllCourses();
      const templateData = template.templateData;

      // TODO: Handle credits courses while creating template

      // const filteredTemplate = templateData.map((sem) => {
      // return sem.items.filter((course: string) => {
      // if (typeof course === 'object') return true;

      // return !coursesFromCredits.some((credit) => credit.utdCourseCode === course);
      // });
      // });

      const numOfSemesters = templateData.length;
      // const creditSemesters: Semester[] = [];

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
              name: sem.items[j].name + ' Course',
              creditHours: 3,
              description: `Chose one of the ${sem.items[j].name} courses for this`,
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
          name: i.toString(),
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
        where: { id: ctx.session.user.id },
        data: {
          plans: plans,
        },
      });
      console.log({ updatedUser });
      return updatedUser;
    } catch (error) {
      console.error(error);
    }
  }),
});
