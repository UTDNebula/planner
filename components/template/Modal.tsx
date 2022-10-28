import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

// TODO: Move to server once we use server-side rendering
import dummyTemplate from '../../data/degree_template.json';
import { getAllCourses } from '../../modules/common/api/templates';
import { Course, Semester, StudentPlan } from '../../modules/common/data';
import { dummyPlan } from '../../modules/planner/plannerUtils';
import { RootState } from '../../modules/redux/store';
import { updatePlan } from '../../modules/redux/userDataSlice';
interface TemplateModalProps {
  setOpenTemplateModal: (flag: boolean) => void;
}
export default function TemplateModal({ setOpenTemplateModal }: TemplateModalProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const coursesFromCredits = [...useSelector((state: RootState) => state.creditsData.credits)];

  // Sorting the template in alphabetical order
  const orderedTemplate = Object.keys(dummyTemplate)
    .sort()
    .reduce((obj, key) => {
      obj[key] = dummyTemplate[key];
      return obj;
    }, {});

  const handleTemplateCreation = async (major: string) => {
    if (major === 'empty') {
      const newPlan: StudentPlan = dummyPlan;
      newPlan.id = uuid();
      dispatch(updatePlan(newPlan));
      return router.push(`/app/plans/${newPlan.id}`);
    }

    const courses = await getAllCourses();
    const selectedTemplate = orderedTemplate[major];

    // removing duplicates in creditSlice courses
    const filteredCoursesFromCredits = coursesFromCredits.filter((course) => {
      for (let i = 0; i < selectedTemplate.length; i++) {
        if (selectedTemplate[i].includes(course.utdCourseCode)) {
          return false;
        }
      }
      return true;
    });

    const numOfSemesters = selectedTemplate.length;
    const creditCoursesPerSemester = Math.ceil(filteredCoursesFromCredits.length / numOfSemesters);

    const semesters: Semester[] = [];
    const year = new Date().getFullYear();

    // TODO: Move semester creation to generateSemesters
    let season = 'Fall';

    for (let i = 0; i < numOfSemesters; i++) {
      const sem = selectedTemplate[i];
      const semCourses: Course[] = [];

      const semTitle = `${season} ${year + Math.floor(i / 2)}`;
      const semCode = `${year + Math.floor(i / 2)}${season[0].toLowerCase()}`;
      season = season === 'Fall' ? 'Spring' : 'Fall';

      const semester: Semester = { title: semTitle, code: semCode, courses: semCourses };

      for (let j = 0; j < sem.length; j++) {
        let course: Course;
        if (typeof sem[j] === 'object') {
          course = {
            id: uuid(),
            title: sem[j].options + ' Course',
            creditHours: 3,
            description: `Chose one of the ${sem[j].options} courses for this`,
            catalogCode: '',
          };
        } else {
          try {
            const { id, name: title, description, hours } = courses[sem[j]];
            const courseId = id.toString();
            course = {
              id: courseId,
              title,
              catalogCode: sem[j],
              description,
              creditHours: +hours,
            };
          } catch (e) {
            // TODO: Handle this better, preferably move to server and use a logger
            continue;
          }
        }
        semCourses.push(course);
      }

      // equally distributing courses for now
      for (let j = 0; j < creditCoursesPerSemester; j++) {
        const creditCourse = filteredCoursesFromCredits.pop();
        if (creditCourse) {
          const courseDetails = courses[creditCourse.utdCourseCode];
          const course: Course = {
            id: courseDetails.id.toString(),
            title: courseDetails.name,
            catalogCode: creditCourse.utdCourseCode,
            description: courseDetails.description,
            creditHours: +courseDetails.hours,
          };
          semCourses.push(course);
        }
      }
      semester.courses = semCourses;
      semesters.push(semester);
    }

    const routeId = uuid();
    const planTitle = major + ' Degree Plan';
    const planMajor = major;
    const newPlanFromTemplate: StudentPlan = {
      id: routeId,
      title: planTitle,
      major: planMajor,
      semesters,
    };

    dispatch(updatePlan(newPlanFromTemplate));
    router.push(`/app/plans/${routeId}`);
  };

  return (
    <div
      onClick={() => setOpenTemplateModal(false)}
      className="w-full h-full top-0 left-0 absolute flex items-center justify-center backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white relative max-w-4xl m-8 max-h-[90vh] w-full overflow-y-scroll flex-col gap-2 rounded-lg items-center justify-center p-4"
      >
        <div className="flex justify-center items-center">
          <div className="p-2 text-2xl">Start fresh with an</div>
          <button
            className="p-2 rounded hover:bg-[#3E61ED] hover:text-white transition-colors border-2 border-[#3e61ed]"
            onClick={() => handleTemplateCreation('empty')}
          >
            Empty Plan
          </button>
        </div>
        <div className="text-center p-2 text-4xl font-bold">OR</div>
        <div className="text-center text-2xl p-2">Start with one of the templates</div>

        <div className="flex flex-row flex-wrap justify-center gap-2 px-2 py-4">
          {Object.keys(orderedTemplate).map((k, v) => {
            return (
              <button
                className="p-4 rounded hover:bg-[#3E61ED] hover:text-white transition-colors border-2 border-[#3e61ed]"
                onClick={() => handleTemplateCreation(k)}
                key={k}
              >
                {k}
              </button>
            );
          })}
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
