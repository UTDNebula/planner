import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import React, { Fragment } from 'react';
import superjson from 'superjson';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';


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
  return (
    <>
      <button className="m-4 p-4 font-bold bg-red-400" onClick={() => handlePlanDelete()}>
        Delete Plan
      </button>
      <button className="m-4 p-4 font-bold bg-red-400" onClick={() => handleSemesterCreate()}>
        Add Semester
      </button>
      <button className="m-4 p-4 font-bold bg-red-400" onClick={() => handleSemesterDelete()}>
        Delete Semester
      </button>
      <div>{planQuery.data?.name}</div>
      {planQuery.data?.semesters.map((sem) => {
        return (
          <div key={sem.code} className="p-2 m-2 border-2 border-blue-500">
            <div className="font-bold">{sem.name}</div>

            {sem.courses.map((course) => {
              return (
                <div key={course.id} className="p-2">
                  <div>{course.name}</div>
                  <div>{course.description}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
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
