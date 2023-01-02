import { trpc } from '@/utils/trpc';
import CloseIcon from '@mui/icons-material/Close';

// TODO: Move to server once we use server-side rendering

import DataGrid from '../credits/DataGrid';
import SearchBar from '../credits/SearchBar';

interface TemplateModalProps {
  setOpenTemplateModal: (flag: boolean) => void;
}
export default function TemplateModal({ setOpenTemplateModal }: TemplateModalProps) {
  // const router = useRouter();
  // const dispatch = useDispatch();
  // const coursesFromCredits = [...useSelector((state: RootState) => state.creditsData.credits)];

  const utils = trpc.useContext();
  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });
  const { data, isError } = trpc.template.getAllTemplates.useQuery();
  if (isError) {
    console.error('Error fetching templates');
    return <div>Error fetching templates</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }
  const templates = data;

  // const [templateQuery, setTemplateQuery] = useState('');

  const orderedTemplate = templates?.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  console.log('OrderedTemplate', orderedTemplate);
  // const handleTemplateCreation = async (major: string) => {
  //   console.log({ major });
  //   if (major === 'empty') {
  //     const newPlan: StudentPlan = { ...dummyPlan, id: uuid() };
  //     dispatch(updatePlan(newPlan));
  //     return router.push(`/app/plans/${newPlan.id}`);
  //   }

  //   const courses = await getAllCourses();
  //   const selectedTemplate = orderedTemplate[major];

  //   const filteredTemplate = selectedTemplate.map((sem) => {
  //     return sem.filter((course: string) => {
  //       if (typeof course === 'object') return true;

  //       return !coursesFromCredits.some((credit) => credit.utdCourseCode === course);
  //     });
  //   });
  //   const numOfSemesters = filteredTemplate.length;

  //   const semesters: Semester[] = [];
  //   const creditSemesters: Semester[] = [];

  //   coursesFromCredits.sort((a, b) => {
  //     if (!a.semester || !b.semester) return;
  //     if (a.semester.year === b.semester.year) {
  //       return semMap[b.semester.semester] < semMap[a.semester.semester] ? -1 : 1;
  //     }
  //     return a.semester.year - b.semester.year;
  //   });

  //   coursesFromCredits.forEach((course) => {
  //     const { name: title, description, hours, prerequisites } = courses[course.utdCourseCode];

  //     const creditCourse: Course = {
  //       id: uuid(),
  //       title,
  //       catalogCode: course.utdCourseCode,
  //       description,
  //       creditHours: +hours,
  //       prerequisites: prerequisites[0],
  //       validation: { isValid: true, override: false },
  //     };

  //     if (!course.semester) {
  //       const semester = creditSemesters.find((sem) => sem.code === 'transfer');
  //       if (semester) {
  //         semester.courses.push(creditCourse);
  //       } else {
  //         creditSemesters.push({
  //           code: 'transfer',
  //           title: 'Transfer Credits',
  //           courses: [creditCourse],
  //         });
  //       }
  //     } else {
  //       const semester = creditSemesters.find(
  //         (sem) => sem.code === course.semester.year + course.semester.semester,
  //       );
  //       if (semester) {
  //         semester.courses.push(creditCourse);
  //       } else {
  //         creditSemesters.push({
  //           code: course.semester.year + course.semester.semester,
  //           title: semMap[course.semester.semester] + ' ' + course.semester.year,
  //           courses: [creditCourse],
  //         });
  //       }
  //     }
  //   });
  //   const year = new Date().getFullYear();

  //   let season = 'Fall';

  //   for (let i = 0; i < numOfSemesters; i++) {
  //     const sem = filteredTemplate[i];
  //     const semCourses: Course[] = [];

  //     const semTitle = `${season} ${year + Math.floor((i + 1) / 2)}`;
  //     const semCode = `${year + Math.floor((i + 1) / 2)}${season[0].toLowerCase()}`;
  //     season = season === 'Fall' ? 'Spring' : 'Fall';

  //     const semester: Semester = { title: semTitle, code: semCode, courses: semCourses };

  //     for (let j = 0; j < sem.length; j++) {
  //       let course: Course;
  //       if (typeof sem[j] === 'object') {
  //         course = {
  //           id: uuid(),
  //           title: sem[j].options + ' Course',
  //           creditHours: 3,
  //           description: `Chose one of the ${sem[j].options} courses for this`,
  //           catalogCode: '',
  //           prerequisites: undefined,
  //           validation: { isValid: true, override: false },
  //         };
  //       } else {
  //         try {
  //           const { name: title, description, hours, prerequisites } = courses[sem[j]];
  //           course = {
  //             id: uuid(),
  //             title,
  //             catalogCode: sem[j],
  //             description,
  //             creditHours: +hours,
  //             prerequisites: prerequisites[0],
  //             validation: { isValid: true, override: false },
  //           };
  //         } catch (e) {
  //           // TODO: Handle this better, preferably move to server and use a logger
  //           continue;
  //         }
  //       }
  //       semCourses.push(course);
  //     }
  //     semester.courses = semCourses;
  //     semesters.push(semester);
  //   }

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
  const handleTemplateCreation = async (major: string) => {
    // console.log(orderedTemplate);
    console.log({ major });

    const selectedTemplate = templates.filter((template) => {
      if (template.name === major) {
        return template;
      }
    });
    console.log(selectedTemplate[0].id);

    try {
      await createUserPlan.mutateAsync(selectedTemplate[0].id);
    } catch (error) {}
  };
  return (
    <div
      onClick={() => setOpenTemplateModal(false)}
      className="w-full h-full left-0 top-0  absolute flex items-center justify-center backdrop-blur-md z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white relative max-w-4xl m-8 max-h-[90vh] w-full overflow-y-scroll flex-col gap-2 rounded-lg items-center justify-center p-10"
      >
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="p-3 text-2xl">Start fresh with an</div>
          <button
            className="p-2 rounded-lg font-semibold bg-[#3E61ED] hover:bg-[#3552C9] text-white transition-colors border-2 border-[#3e61ed]"
            onClick={() => handleTemplateCreation('empty')}
          >
            Empty Plan
          </button>

          <div className="text-center text-2xl ">OR</div>
          <div className="text-center text-2xl font-medium">One of the templates</div>
        </div>
        <div className="sticky pt-10 -top-10 bg-white z-50">
          <SearchBar
            placeholder="Search template"
            updateQuery={(query) => setTemplateQuery(query)}
          />
        </div>

        <div className="gap-2 px-2 py-4 max-h-[400px]">
          <DataGrid
            columns={[
              {
                title: 'Templates',
                key: 'templateName',
              },
            ]}
            rows={
              [...orderedTemplate.map((x) => ({ templateName: x.name }))] as {
                templateName: string;
              }[]
            }
            childrenProps={{
              headerProps: {
                style: {
                  padding: '20px 0',
                },
              },
              gridProps: {
                style: {},
              },
              rowProps: {
                style: {
                  borderTop: '1px solid #DEDFE1',
                  padding: '20px 0',
                  cursor: 'pointer',
                },
                onClick: (row) => {
                  handleTemplateCreation(row.templateName);
                },
              },
            }}
            RowCellComponent={({ children }) => <span className="text-black">{children}</span>}
            TitleComponent={({ children }) => <h4 className="text-black">{children}</h4>}
            LoadingComponent={() => <h2 className="text-black">Loading...</h2>}
          />
        </div>
        <button
          onClick={() => setOpenTemplateModal(false)}
          className="top-0 right-0 absolute border-black border-2 rounded-lg m-2 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <CloseIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
}
