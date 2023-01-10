import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import superjson from 'superjson';
import { CircularProgress, Dialog, Theme } from '@mui/material';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import ErrorMessage from '../../../components/common/ErrorMessage';
import WarningMessageModal from '../../../components/common/WarningMessageModal';
import PlannerContainer from '../../../components/planner/PlannerContainer';
import PlanningToolbar, {
  usePlanningToolbar,
} from '../../../components/planner/PlanningToolbar/PlanningToolbar';
import { useSemesterNavigation } from '../../../components/planner/SemesterNavigationDrawer/SemesterNavigationDrawer';
import useSearch from '../../../components/search/search';
import { CourseAttempt } from '../../../modules/auth/auth-context';
import { loadCourseAttempts } from '../../../modules/common/api/courseAttempts';
import { loadDummyCourses } from '../../../modules/common/api/courses';

import { usePlan } from '../../../modules/planner/hooks/usePlan';
import { usePlannerContainer } from '../../../modules/planner/hooks/usePlannerContainer';
import { RootState } from '../../../modules/redux/store';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { trpc } from '@/utils/trpc';
import Planner from '@/components/planner/Planner';
import validationData from '@/data/dummyValidation.json';
import { DegreeRequirementGroup } from '@/components/planner/types';
import { Semester } from '@prisma/client';

/**
 * Styling for the add & remove semesters buttons
 */
// const useStyles = makeStyles()((theme: Theme) => {
//   return {
//     fabContainer: {
//       position: 'fixed',
//       top: theme.spacing(16),
//       right: theme.spacing(2),
//       display: 'flex',
//       flexDirection: 'column',
//     },
//     fab: {
//       margin: '8px',
//       backgroundColor: '#3E61ED',
//       '&:hover': {
//         backgroundColor: '#0040AF',
//       },
//     },
//   };
// });

/**
 * A page that displays the details of a specific student academic plan.
 * // TODO: Decide planner navigation UX
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const utils = trpc.useContext();
  const router = useRouter();
  const { planId } = props;
  const planQuery = trpc.plan.getPlanById.useQuery(planId);
  const semesters = planQuery.data?.semesters ?? [];
  //   const [warning, setWarning] = React.useState(false);

  //   const [courseAttempts, setCourseAttempts] = React.useState<CourseAttempt[]>([]);

  //   const { results, updateQuery, getResults, err } = useSearch({
  //     getData: loadDummyCourses,
  //     initialQuery: '',
  //     filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
  //   });

  //   const { plan, loadPlan, exportPlan, handleSelectedPlanChange, persistChanges } = usePlan();

  //   const { title, setTitle, section, setSection, showTabs, hideTabs, shouldShowTabs } =
  //     usePlanningToolbar(0);

  //   const {
  //     semesters,
  //     addSemester,
  //     removeSemester,
  //     updateSemesters,
  //     handleOnDragEnd,
  //     removeItemFromList,
  //     setPersist,
  //   } = usePlannerContainer(persistChanges, getResults);

  //   // Load data
  //   React.useEffect(() => {
  //     if (router.isReady) {
  //       const loadData = async () => {
  //         const newPlan = loadPlan(planId);
  //         setPersist(true);
  //         updateSemesters(newPlan.semesters);
  //         // TODO: Move this logic to custom hook for CourseA
  //         const courseAttempts: CourseAttempt[] = await loadCourseAttempts();
  //         setCourseAttempts(courseAttempts);
  //         setTitle(newPlan.title);
  //       };
  //       loadData();
  //     }
  //   }, [router.isReady]);

  //   /**
  //    * Re-renders the planner UI with the given plan.
  //    */
  //   const updateLoadedPlan = (newPlan: StudentPlan) => {
  //     console.log('Loading new plan in UI', newPlan);
  //     updateSemesters(newPlan.semesters);
  //   };

  //   const updateOverride = (id: string) => {
  //     // Find course & update it
  //     const newSemesters = semesters.map((semester) => {
  //       const newCourses = semester.courses.map((course, idx) => {
  //         if (course.id === id) {
  //           if (course.validation.override === false)
  //             return { ...course, validation: { isValid: true, override: true } };
  //           else return { ...course, validation: { isValid: false, override: false } };
  //         }
  //         return course;
  //       });
  //       return { ...semester, courses: newCourses };
  //     });
  //     updateSemesters(newSemesters);
  //   };

  //   // TODO: Maybe integrate this with current degree planner
  //   // if not, then remove
  //   // const navSemesters = plan.semesters;
  //   // const { scrollToSemseter, ...navProps } = useSemesterNavigation(navSemesters);

  //   // const showLeftSidebar = true;
  //   const handleTabChange = (tabIndex: number) => {
  //     setSection(tabIndex);
  //   };

  //   // const { classes } = useStyles();

  //   const content = (
  //     <PlannerContainer
  //       items={semesters}
  //       onDragEnd={handleOnDragEnd}
  //       results={results}
  //       updateQuery={updateQuery}
  //       removeCourse={removeItemFromList}
  //       updateOverride={updateOverride}
  //       addSemester={addSemester}
  //       removeSemester={removeSemester}
  //     ></PlannerContainer>
  //   );
  //   const openValidationModal = () => {
  //     setShowValidation(true);
  //   };
  //   const [showValidation, setShowValidation] = useState(false);
  //   return (
  //     <>
  //       <ValidationDialog
  //         planId={planId}
  //         open={showValidation}
  //         onClose={() => setShowValidation(false)}
  //       />
  //       <div className="flex flex-col h-[calc(100vh-50px)] overflow-y-hidden">
  //         <div className="flex-none">
  //           {err !== undefined && ErrorMessage(err)}
  //           <PlanningToolbar
  //             setPlanTitle={setTitle}
  //             planId={plan.id}
  //             sectionIndex={section}
  //             planTitle={title}
  //             shouldShowTabs={shouldShowTabs}
  //             onTabChange={handleTabChange}
  //             onValidate={openValidationModal}
  //             updateSemesters={updateSemesters}
  //             onExportPlan={() => {
  //               console.log('Exporting plan');
  //               exportPlan(plan);
  //             }}
  //             onImportPlan={(event) => {
  //               handleSelectedPlanChange(event, updateLoadedPlan);
  //             }}
  //           />
  //         </div>
  //         <div className="flex-1">{content}</div>
  //       </div>
  //       {warning && (
  //         <WarningMessageModal
  //           message="Insert possible warning/message here"
  //           setWarning={setWarning}
  //         />
  //       )}
  //     </>
  //   );
  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const createSemester = trpc.plan.addEmptySemesterToPlan.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const deleteSemester = trpc.plan.deleteSemester.useMutation({
    async onSuccess() {
      await utils.plan.getPlanById.invalidate(planId);
    },
  });

  const handlePlanDelete = async () => {
    try {
      const deletedPlan = await deletePlan.mutateAsync(planId);
      if (deletedPlan) {
        router.push('/app/home');
      }

      // TODO: Handle delete error
      router.push('/app/home');
    } catch (error) {}
  };
  const handleSemesterCreate = async () => {
    try {
      // TODO: Handle deletion errors

      await createSemester.mutateAsync(planId);
    } catch (error) {}
  };
  const handleSemesterDelete = async () => {
    try {
      // TODO: Handle deletion errors

      await deleteSemester.mutateAsync(planId);
    } catch (error) {}
  };

  const handleBack = () => {
    return router.push('/app/home');
  };

  const [degreeData, setDegreeData] = useState<DegreeRequirementGroup[]>(validationData);

  return (
    <div className="w-screen flex flex-col bg-[#FFFFFF] p-[44px]">
      <div className="mt-4 mb-10 flex flex-row">
        <button onClick={handleBack}>Back</button>
        <div className="text-2xl">My Plan</div>{' '}
      </div>
      <Planner
        degreeRequirements={degreeData}
        semesters={semesters}
        onRemoveCourseFromSemester={async (targetSemester, targetCourse) => {
          setSemesters((semesters) =>
            semesters.map((semester) => {
              if (semester.id === targetSemester.id) {
                return {
                  ...semester,
                  courses: semester.courses.filter(
                    (course: { id: string }) => course.id !== targetCourse.id,
                  ),
                };
              }

              return semester;
            }),
          );
          return {
            level: 'ok',
            message: `Removed ${targetCourse.catalogCode} from ${targetSemester.name}`,
          };
        }}
        onAddCourseToSemester={async (targetSemester, newCourse) => {
          // check for duplicate course
          const isDuplicate = Boolean(
            targetSemester.courses.find((course) => course.catalogCode === newCourse.catalogCode),
          );
          if (isDuplicate) {
            return {
              level: 'warn',
              message: `You're already taking ${newCourse.catalogCode} in ${targetSemester.name}`,
            };
          }

          setSemesters((semesters) =>
            semesters.map((semester) =>
              semester.id === targetSemester.id
                ? { ...semester, courses: [...semester.courses, newCourse] }
                : semester,
            ),
          );

          return {
            level: 'ok',
            message: `Added ${newCourse.catalogCode} to ${targetSemester.name}`,
          };
        }}
        onMoveCourseFromSemesterToSemester={async (
          originSemester,
          destinationSemester,
          courseToMove,
        ) => {
          // check for duplicate course
          const isDuplicate = Boolean(
            destinationSemester.courses.find(
              (course) => course.catalogCode === courseToMove.catalogCode,
            ),
          );
          if (isDuplicate) {
            return {
              level: 'warn',
              message: `You're already taking ${courseToMove.catalogCode} in ${destinationSemester.name}`,
            };
          }

          setSemesters((semesters) =>
            semesters.map((semester) => {
              if (semester.id === destinationSemester.id) {
                return { ...semester, courses: [...semester.courses, courseToMove] };
              }

              if (semester.id === originSemester.id) {
                return {
                  ...semester,
                  courses: semester.courses.filter(
                    (course: { id: string }) => course.id !== courseToMove.id,
                  ),
                };
              }

              return semester;
            }),
          );

          return {
            level: 'ok',
            message: `Moved ${courseToMove.catalogCode} from ${originSemester.name} to ${destinationSemester.name}`,
          };
        }}
      />
    </div>
  );
  // return (

  //   <>
  //     <button className="m-4 p-4 font-bold bg-red-400" onClick={() => handlePlanDelete()}>
  //       Delete Plan
  //     </button>
  //     <button className="m-4 p-4 font-bold bg-red-400" onClick={() => handleSemesterCreate()}>
  //       Add Semester
  //     </button>
  //     <button className="m-4 p-4 font-bold bg-red-400" onClick={() => handleSemesterDelete()}>
  //       Delete Semester
  //     </button>
  //     <div>{planQuery.data?.name}</div>
  //     {planQuery.data?.semesters.map((sem) => {
  //       return (
  //         <div key={sem.code} className="p-2 m-2 border-2 border-blue-500">
  //           <div className="font-bold">{sem.name}</div>

  //           {sem.courses.map((course) => {
  //             return (
  //               <div key={course.id} className="p-2">
  //                 <div>{course.name}</div>
  //                 <div>{course.description}</div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       );
  //     })}
  //   </>
  // );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ planId: string }>) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  const planId = context.params?.planId as string;
  console.log('planId', planId);

  await ssg.plan.getPlanById.prefetch(planId);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      planId,
    },
  };
}

// TODO: Refactor everything below this line into a separate file

// const ValidationDialog = (props: { open: boolean; onClose: () => void; planId: string }) => {
//   const { open, onClose, planId } = props;

//   const plan = useSelector((state: RootState) => state.userData.plans[planId]);

//   const major = plan !== undefined ? plan.major : '';

//   // TODO: Clean up this reformatting logic
//   // Change major name to one appropriate for API
//   // Major names can be found here: https://github.com/ez314/Degree-Validator/tree/main/requirements
//   const formattedMajor = `${major.split(' ').join('_').toLowerCase()}_bs`;
//   // alert(formattedMajor);

//   const [loading, setLoading] = useState(true);
//   const [outputData, setOutputData] = useState<DVResponse>(null);
//   const ac = new AbortController();
//   const performValidation = async () => {
//     const body: DVRequest = {
//       courses: plan.semesters
//         .flatMap((s) => s.courses)
//         .map((c) => {
//           const split = c.catalogCode.split(' ');
//           const department = split[0];
//           const courseNumber = Number(split[1]);
//           const level = Math.floor(courseNumber / 1000);
//           const hours = Math.floor((courseNumber - level * 1000) / 100);
//           return {
//             name: c.catalogCode,
//             department: department,
//             level,
//             hours,
//           };
//         }),
//       bypasses: [],
//       degree: formattedMajor,
//     };

//     body.courses = body.courses.filter((course) => course.name !== '');

//     const res = await fetch(`${process.env.NEXT_PUBLIC_VALIDATION_SERVER}/validate-degree-plan`, {
//       method: 'POST',
//       body: JSON.stringify(body),
//       signal: ac.signal,
//       headers: {
//         'content-type': 'application/json',
//       },
//     });

//     const response = (await res.json()) as DVResponse;

//     if (res.status === 200) {
//       setOutputData(response);
//       setLoading(false);
//     } else if (res.status === 404) {
//       res.status === 404
//         ? alert(
//             'This major is not yet supported! If you want to help us support degree plan validation for more majors, check out this link: https://forms.gle/1KeszKHRkooVjyxn9',
//           )
//         : alert('An error has occured');
//       onClose();
//     }
//   };
//   useEffect(() => {
//     if (!open) {
//       setLoading(true);
//       return;
//     }
//     performValidation();
//     return () => ac.abort();
//   }, [open]);
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <div className="p-10">
//         <h1>Degree Validation</h1>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <ul className="list-disc">
//             {Object.entries(outputData).map(([key, value]) => {
//               return (
//                 <li className="my-2" key={key}>
//                   <div className="flex justify-between">
//                     <p className="font-bold">{key}</p>{' '}
//                     <p className="text-right">
//                       {value.isfilled ? `Complete` : `Incomplete`} ({value.hours} credits)
//                     </p>
//                   </div>
//                   <ul className="ml-4 list-disc">
//                     {Object.keys(value.courses).length != 0 ? (
//                       Object.entries(value.courses).map(([course, credits]) => (
//                         <li key={course}>
//                           {course} - {credits} credits
//                         </li>
//                       ))
//                     ) : (
//                       <li className="italic">No credits planned for this requirement.</li>
//                     )}
//                   </ul>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </Dialog>
//   );
// };

interface DVRequest {
  courses: DVCourse[];
  bypasses: DVBypass[];
  degree: string;
}

interface DVResponse {
  [requirement: string]: DVRequirement;
}

interface DVRequirement {
  courses: Record<string, number>;
  hours: number;
  isfilled: boolean;
}

interface DVBypass {
  course: string;
  requirement: string;
  hours: number;
}

interface DVCourse {
  name: string;
  department: string;
  level: number;
  hours: number;
}

// import superjson from 'superjson';

// import { GetServerSidePropsContext, NextPage } from 'next';
// import { useState } from 'react';

// import Planner from '@/components/planner/Planner';
// import { Semester, DegreeRequirementGroup } from '@/components/planner/types';
// import validationData from '@/data/dummyValidation.json';
// import { Course } from '@/modules/common/data';
// import { useRouter } from 'next/router';
// import HomeDrawer from '@/components/newhome/HomeDrawer';
// import useMedia from '@/modules/common/media';
// import { authOptions } from '@/pages/api/auth/[...nextauth]';
// import { createContextInner } from '@/server/trpc/context';
// import { appRouter } from '@/server/trpc/router/_app';
// import { Home } from '@mui/icons-material';
// import { createProxySSGHelpers } from '@trpc/react-query/ssg';
// import { unstable_getServerSession } from 'next-auth';

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await unstable_getServerSession(context.req, context.res, authOptions);
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: await createContextInner({ session }),
//     transformer: superjson,
//   });

//   await ssg.plan.getPlanById(context.params['planId']);
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//     },
//   };
// }
// export default function MiniDrawer() {
//   const isDesktop = useMedia('(min-width: 900px)');

//   return (
//     <>
//       <HomeDrawer isDesktop={isDesktop} />
//       <Home key={0} />
//     </>
//   );
// }

// MiniDrawer.auth = true;

// const Test3Page: NextPage = () => {
//   const [degreeData, setDegreeData] = useState<DegreeRequirementGroup[]>(validationData);

//   const [semesters, setSemesters] = useState<Semester[]>([
//     {
//       id: '1',
//       name: "Fall'22",
//       courses: [
//         {
//           id: '3',
//           catalogCode: 'CS 2305',
//           creditHours: 10,
//           description: '',
//           title: 'Discrete Math',
//           validation: { isValid: true, override: false },
//         },
//       ],
//     },
//     { id: '2', name: "Spring'23", courses: [] },
//     { id: '3', name: "Summer'23", courses: [] },
//     {
//       id: '4',
//       name: "Fall'23",
//       courses: [
//         {
//           id: '3',
//           catalogCode: 'CS 2305',
//           creditHours: 10,
//           description: '',
//           title: 'Discrete Math',
//           validation: { isValid: false, override: false },
//         },
//       ],
//     },
//     { id: '5', name: "Spring'24", courses: [] },
//     { id: '6', name: "Summer'24", courses: [] },
//     {
//       id: '7',
//       name: "Fall'24",
//       courses: [],
//     },
//     { id: '8', name: "Spring'25", courses: [] },
//     { id: '9', name: "Summer'25", courses: [] },
//     {
//       id: '10',
//       name: "Fall'25",
//       courses: [],
//     },
//     { id: '11', name: "Spring'26", courses: [] },
//     { id: '12', name: "Summer'26", courses: [] },
//   ]);

//   const router = useRouter();

//   const handleBack = () => {
//     return router.push('/app/home');
//   };
//   // Create

//   return (
//     <div className="w-screen flex flex-col bg-[#FFFFFF] p-[44px]">
//       <div className="mt-4 mb-10 flex flex-row">
//         <button onClick={handleBack}>Back</button>
//         <div className="text-2xl">My Plan</div>{' '}
//       </div>
//       <Planner
//         degreeRequirements={degreeData}
//         semesters={semesters}
//         onRemoveCourseFromSemester={async (targetSemester, targetCourse) => {
//           setSemesters((semesters) =>
//             semesters.map((semester) => {
//               if (semester.id === targetSemester.id) {
//                 return {
//                   ...semester,
//                   courses: semester.courses.filter((course) => course.id !== targetCourse.id),
//                 };
//               }

//               return semester;
//             }),
//           );
//           return {
//             level: 'ok',
//             message: `Removed ${targetCourse.catalogCode} from ${targetSemester.name}`,
//           };
//         }}
//         onAddCourseToSemester={async (targetSemester, newCourse) => {
//           // check for duplicate course
//           const isDuplicate = Boolean(
//             targetSemester.courses.find((course) => course.catalogCode === newCourse.catalogCode),
//           );
//           if (isDuplicate) {
//             return {
//               level: 'warn',
//               message: `You're already taking ${newCourse.catalogCode} in ${targetSemester.name}`,
//             };
//           }

//           setSemesters((semesters) =>
//             semesters.map((semester) =>
//               semester.id === targetSemester.id
//                 ? { ...semester, courses: [...semester.courses, newCourse] }
//                 : semester,
//             ),
//           );

//           return {
//             level: 'ok',
//             message: `Added ${newCourse.catalogCode} to ${targetSemester.name}`,
//           };
//         }}
//         onMoveCourseFromSemesterToSemester={async (
//           originSemester,
//           destinationSemester,
//           courseToMove,
//         ) => {
//           // check for duplicate course
//           const isDuplicate = Boolean(
//             destinationSemester.courses.find(
//               (course) => course.catalogCode === courseToMove.catalogCode,
//             ),
//           );
//           if (isDuplicate) {
//             return {
//               level: 'warn',
//               message: `You're already taking ${courseToMove.catalogCode} in ${destinationSemester.name}`,
//             };
//           }

//           setSemesters((semesters) =>
//             semesters.map((semester) => {
//               if (semester.id === destinationSemester.id) {
//                 return { ...semester, courses: [...semester.courses, courseToMove] };
//               }

//               if (semester.id === originSemester.id) {
//                 return {
//                   ...semester,
//                   courses: semester.courses.filter((course) => course.id !== courseToMove.id),
//                 };
//               }

//               return semester;
//             }),
//           );

//           return {
//             level: 'ok',
//             message: `Moved ${courseToMove.catalogCode} from ${originSemester.name} to ${destinationSemester.name}`,
//           };
//         }}
//       />
//     </div>
//   );
// };

// export default Test3Page;
