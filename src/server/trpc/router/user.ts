import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  Prisma,
  type User,
  type Plan,
  type Profile,
  type Semester,
  type Course,
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
      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }
      const major = template.name;
      console.log({ major });
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

      console.log({ templateData });
      // return templateData;
      const numOfSemesters = templateData.length;
      // let semesters: Prisma.SemesterCreateNestedManyWithoutPlanInput;
      // let courses: Prisma.CourseCreateNestedManyWithoutSemesterInput;

      // const semesters: Array<Prisma.SemesterCreateNestedManyWithoutPlanInput> = [];

      // const semesters:  = [];
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
      // const plan: Prisma.PlanCreateWithoutUserInput;
      const semesters: Array<Prisma.SemesterCreateNestedWithoutPlanInput> = [];
      let season = 'Fall';

      for (let i = 0; i < numOfSemesters; i++) {
        const sem = templateData[i];

        const semCourses: Array<Prisma.CourseCreateNestedManyWithoutSemesterInput> = [];
        const semTitle = `${season} ${year + Math.floor((i + 1) / 2)}`;
        const semCode = `${year + Math.floor((i + 1) / 2)}${season[0].toLowerCase()}`;
        season = season === 'Fall' ? 'Spring' : 'Fall';
        // const semester: Prisma.SemesterCreateWithoutPlanInput = { name: semTitle, code: semCode, courses: courses}
        // const semester: Semester = { title: semTitle, code: semCode, courses: semCourses };

        const semester: Prisma.SemesterCreateNestedManyWithoutPlanInput = {
          name: semTitle,
          code: semCode,
          courses: undefined,
        };
        for (let j = 0; j < sem.items.length; j++) {
          let course: Course;
          if (sem.items[j].type === 'OPTIONAL') {
            course = {
              name: sem.items[j].name + ' Course',
              creditHours: 3,
              description: `Chose one of the ${sem.items[j].name} courses for this`,
              catalogCode: '',
            };
          } else {
            try {
              const { name: title, description, hours } = allCourses[sem.items[j].name];
              course = {
                name: title,
                catalogCode: sem.items[j]?.name,
                description: description,
                creditHours: +hours,
              };
            } catch (e) {
              // TODO: Handle this better, preferably move to server and use a logger
              continue;
            }
          }
          semCourses.push(course);
        }
        semester.courses = semCourses;
        semesters.push(semester);
      }
      // console.log({ semesters });
      // for (let i = 0; i < semesters.length; i++) {
      //   console.log('Semester: ', i);
      //   for (let j = 0; j < semesters[i].courses.length; j++) {
      //     console.log(semesters[i].courses[j]);
      //   }
      // }
      const plan: Prisma.PlanCreateWithoutUserInput = { name: major, semesters: semesters };
      // console.log(plan);

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          plans: {
            upsert: {
              create: {
                name: major,
                semesters: [...semesters],
              },
              update: {
                name: major,
                semesters: {
                  create: [...semesters],
                },
              },
            },
          },
        },
      });
      console.log({ updatedUser });
      return templateData;
      //   const routeId = uuid();
      //   const planTitle = major + ' Degree Plan';
      //   const planMajor = major.split('(')[0]; // TODO: Change later; this formats the major to match in major.json()
      //   const newPlanFromTemplate: StudentPlan = {
      //     id: routeId,
      //     title: planTitle,
      //     major: planMajor,
      //     semesters: [...creditSemesters, ...semesters],
      //   };
      //   dispatch(updatePlan(newPlanFromTemplate));
      //   router.push(`/app/plans/${routeId}`);
      // };
    } catch (error) {
      console.error(error);
    }
  }),
});
