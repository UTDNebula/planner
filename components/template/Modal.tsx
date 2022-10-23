import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

import dummyTemplate from '../../data/degree_template.json';
import { getAllCourses } from '../../modules/common/api/templates';
import { Course, Semester, StudentPlan } from '../../modules/common/data';
import { updatePlan } from '../../modules/redux/userDataSlice';

interface TemplateModalProps {
  setOpenTemplateModal: (modal: boolean) => void;
}
export default function TemplateModal({ setOpenTemplateModal }: TemplateModalProps) {
  //  console.log(dummyTemplate.CS[0])
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
        const { id, name: title, description, hours } = courses[c];

        const courseId = id.toString();

        const course: Course = {
          id: courseId,
          title,
          catalogCode: c,
          description,
          creditHours: +hours,
        };
        semCourses.push(course);
      });
      semester.courses = semCourses;
      semesters.push(semester);
    });
    console.log(semesters);

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
    <div className="w-full h-full top-0 left-0 absolute flex items-center justify-center">
      <div className="bg-slate-600 text-white flex-col gap-2 items-center justify-center p-4">
        <div className="flex gap-2 items-center justify-between p-2">
          <div className="text-center p-2">Select a Template for the degree plan</div>
          <button
            onClick={() => setOpenTemplateModal(false)}
            className="bg-black rounded p-1 text-white"
          >
            X
          </button>
        </div>
        <div className="flex justify-around gap-2 p-2">
          {Object.keys(dummyTemplate).map((k, v) => {
            return (
              <button onClick={() => handleTemplateCreation(k)} key={k}>
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
