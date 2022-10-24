import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

import dummyTemplate from '../../data/degree_template.json';
import { getAllCourses } from '../../modules/common/api/templates';
import { Course, Semester, StudentPlan } from '../../modules/common/data';
import { updatePlan } from '../../modules/redux/userDataSlice';
type selectiveCourses = {
  options: string;
};

const emptyCourse: Course = {
  id: '',
  title: '',
  creditHours: 0,
  description: '',
  catalogCode: '',
};

interface TemplateModalProps {
  setModal: () => void;
}
export default function TemplateModal({ setModal }: TemplateModalProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleTemplateCreation = async (val: string) => {
    const courses = await getAllCourses();

    const semesters: Semester[] = [];
    const year = new Date().getFullYear();
    let season = 'Fall';
    dummyTemplate[val].map((sem, index) => {
      const semCourses: Course[] = [];
      const semTitle = `${season} ${year + Math.floor(index / 2)}`;
      const semCode = `${year + Math.floor(index / 2)}${season[0].toLowerCase()}`;
      season = season === 'Fall' ? 'Spring' : 'Fall';

      const semester: Semester = { title: semTitle, code: semCode, courses: semCourses };

      sem.map((c) => {
        let course: Course;
        if (typeof c === 'object') {
          course = {
            id: uuid(),
            title: c.options + ' Course',
            creditHours: 3,
            description: `Chose one of the ${c.options} courses for this`,
            catalogCode: '',
          };
        } else {
          try {
            console.log(c);
            const { id, name: title, description, hours } = courses[c];
            const courseId = id.toString();
            course = {
              id: courseId,
              title,
              catalogCode: c,
              description,
              creditHours: +hours,
            };
          } catch (e) {
            console.log(e);
            course = emptyCourse;
          }
        }

        semCourses.push(course);
      });
      semester.courses = semCourses;
      semester.courses = semester.courses.filter((c) => c.id !== '');
      semesters.push(semester);
    });

    const routeId = uuid();
    const planTitle = val + ' Degree Plan';
    const planMajor = val;
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
      onClick={() => setModal()}
      className="w-full h-full top-0 left-0 absolute flex items-center justify-center backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white relative max-w-3xl w-full flex-col gap-2 rounded-lg items-center justify-center p-4"
      >
        <div className="text-center text-2xl px-2 py-4">Select a Template for the degree plan</div>

        <div className="flex flex-row flex-wrap justify-center gap-2 px-2 py-4">
          {Object.keys(dummyTemplate).map((k, v) => {
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
          onClick={() => setModal()}
          className="top-0 right-0 absolute border-black border-2 rounded-lg m-2 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <CloseIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
}
