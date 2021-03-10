import React from 'react';
import { DragDropContext, SensorAPI } from 'react-beautiful-dnd';
// import { Link as RouterLink } from 'react-router-dom';
// import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Course, generateSemesters, SemesterCode, StudentPlan } from '../../app/data';
import SemesterBlockList, { ScrollDirection } from '../../features/planner/SemesterBlockList';
import Footer from '../../components/common/Footer';
import ServiceName from '../../components/common/ServiceName';
import LandingToolbar from './LandingToolbar';
import styles from './LandingPage.module.css';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {},
//     ctaButton: {
//       marginTop: theme.spacing(4),
//     },
//   }),
// );

const SUBTEXT_VARIANTS = ['degree planning tool', 'course planner'];

/**
 * A hook for the drag-and-drop demo functionality.
 *
 * @see https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/sensors/sensor-api.md
 */
function useDemoSensor(plan: StudentPlan) {
  const semesters = plan.semesters;
  console.log(semesters);
  return (api: SensorAPI) => {
    console.log(api);
    // TODO: Make these hooks work
    // const start = React.useCallback(function start(event: MouseEvent) {
    //   // TODO: Swap out wih actual course card IDs
    //   const preDrag = api.tryGetLock('item-2');
    //   if (!preDrag) {
    //     return;
    //   }
    //   preDrag.snapLift();
    //   preDrag.moveDown();
    //   preDrag.drop();
    // }, []);
    // React.useEffect(() => {
    //   window.addEventListener('click', start);
    //   return () => {
    //     window.removeEventListener('click', start);
    //   };
    // }, []);
  };
}

const CS_DEMO_REQUIREMENTS: Course[] = [
  {
    id: '1298',
    title: 'Differential Calculus',
    catalogCode: 'MATH 2413',
    description:
      'Course covers topics in differential calculus of functions of one variable; topics include limits, continuity, derivative, chain rule, implicit differentiation, mean value theorem, maxima and minima, curve sketching, derivatives of inverse trigonometric functions, antiderivative, substitution method, and applications.',
    creditHours: 4,
  },
  {
    id: '1869',
    title: 'Rhetoric',
    catalogCode: 'RHET 1302',
    description:
      'Course covers topics in differential calculus of functions of one variable; topics include limits, continuity, derivative, chain rule, implicit differentiation, mean value theorem, maxima and minima, curve sketching, derivatives of inverse trigonometric functions, antiderivative, substitution method, and applications.',
    creditHours: 3,
  },
  {
    id: '746',
    title: 'Introduction to Engineering and Computer Science',
    catalogCode: 'ECS 1100',
    description:
      'Course covers topics in differential calculus of functions of one variable; topics include limits, continuity, derivative, chain rule, implicit differentiation, mean value theorem, maxima and minima, curve sketching, derivatives of inverse trigonometric functions, antiderivative, substitution method, and applications.',
    creditHours: 1,
  },
  {
    id: '619',
    title: 'Computer Science Laboratory',
    catalogCode: 'CS 1136',
    description:
      'Laboratory course to accompany CS 1336. This course assists students in experiencing elementary programming in a high-level language. May not be used to satisfy degree requirements for majors in the School of Engineering and Computer Science.',
    creditHours: 1,
  },
  {
    id: '625',
    title: 'Programming Fundamentals',
    catalogCode: 'CS 1336',
    description:
      'Introduces the fundamental concepts of structured programming. Topics include software development methodology, data types, control structures, functions, arrays, and the mechanics of running, testing, and debugging. Programming language of choice is C. The class is open to students in the School of Engineering and Computer Science only. May not be used to satisfy degree requirements for majors in the School of Engineering and Computer Science.',
    creditHours: 3,
  },
  {
    id: '79',
    title: 'Exploration of the Arts',
    catalogCode: 'ARTS 1301',
    description:
      "This course introduces students to the physical and intellectual demands required of the author, the performer, and the visual artist. This introduction includes, but is not limited to, the student's production of a creative project as well as written assessments of visual and performing arts.",
    creditHours: 3,
  },
  {
    id: '1299',
    title: 'Integral Calculus',
    catalogCode: 'MATH 2414',
    description:
      'Continuation of Math 2413. Course covers topics in integral calculus, sequences and series. Topics include techniques of integration, improper integrals, and applications. Polar coordinates, parametric equations, and arc length. Infinite sequences and series, tests for convergence, power series, radius of convergence and Taylor series. Three lecture hours and two discussion hours a week; registration in a problem section as well as the exam section is required with MATH 2414. Not all MATH/STAT courses may be counted toward various degree plans. Please consult your degree plan to determine the appropriate MATH/STAT course requirements. Cannot be used to replace MATH 2419.',
    creditHours: 4,
  },
  {
    id: '1685',
    title: 'Mechanics',
    catalogCode: 'PHYS 2325',
    description:
      'Calculus based. Basic physics including a study of space and time, kinematics, forces, energy and momentum, conservation laws, rotational motion, torques, and harmonic oscillation. Two lectures per week. Students will also be registered for an exam section.',
    creditHours: 3,
  },
  {
    id: '1682',
    title: 'Physics Laboratory I',
    catalogCode: 'PHYS 2125',
    description:
      "Laboratory course to accompany any Physics I or Mechanics course. Experiments investigate basic measurements and statistics including error, mean, standard deviation and error propagation; one dimensional and two dimensional motion; Newton's laws; conservation laws of energy and momentum; rotational motion; and oscillations.",
    creditHours: 1,
  },
];

function createDisplayPlan(coursesPerSemester = 4, planId = '2020-cs-undergrad'): StudentPlan {
  console.debug(`Using ${planId} to create demo plan`);

  const semesters = generateSemesters(
    3,
    2020,
    SemesterCode.f,
    false,
    CS_DEMO_REQUIREMENTS,
    coursesPerSemester,
  );

  const plan = {
    id: planId,
    title: 'B.S. in Computer Science',
    major: 'Computer Science',
    semesters: semesters,
  };

  return plan;
}

type Maintainer = {
  name: string;
  role: string;
  link: string;
  image: string;
};

/**
 * The primary landing page for the application.
 *
 * This is mostly for marketing, but we also show some lightweight
 * interactive demos since why not.
 */
export default function LandingPage(): JSX.Element {
  const contents = SUBTEXT_VARIANTS[0];

  const samplePlan = createDisplayPlan();

  const demoSensor = useDemoSensor(samplePlan);

  const generateProfiles = (maintainers: Maintainer[]) => {
    return maintainers.map(({ name, role, link, image }) => {
      return (
        <div key={name}>
          <div className="py-2">
            <img className="rounded-full object-contain" src={image}></img>
          </div>
          <div className="text-headline6 font-bold text-center">{name}</div>
          <div className="text-subtitle1 text-center">{role}</div>
          {link && (
            <div className="text-body1 text-center">
              {/* TODO: Insert icon */}
              <a href={link}>LinkedIn</a>
            </div>
          )}
        </div>
      );
    });
  };

  const currentMaintainers = [
    {
      name: 'Willie Chalmers III',
      role: 'Project Lead',
      link: 'https://www.linkedin.com/in/willie-chalmers-iii/',
      image: '/img/contributor-willie-chalmers-iii.jpg',
    },
    {
      name: 'Sunny Guan',
      role: 'Back-end Developer',
      link: 'https://www.linkedin.com/in/sunny-guan/',
      image: '/img/contributor-sunny-guan.jpg',
    },
  ];

  // const pastMaintainers = [
  //   {
  //     name: 'Aliah Shaira De Guzman',
  //     role: 'Project founder',
  //     link: 'https://www.linkedin.com/in/aliahdg/',
  //     image: 'https://picsum.photos/256',
  //   },
  //   {
  //     name: 'Aishani De Sirkar',
  //     role: 'Sofware Developer',
  //     link: 'https://www.linkedin.com/in/aishanids/',
  //     image: 'https://picsum.photos/256',
  //   },
  //   {
  //     name: 'Medha Aiyah',
  //     role: 'Sofware Developer',
  //     link: 'https://www.linkedin.com/in/medha-aiyah/',
  //     image: 'https://picsum.photos/256',
  //   },
  // ];

  // const classes = useStyles();

  return (
    <div className="min-h-screen min-w-screen">
      <div className="bg-gray-200 max-h-screen max-w-screen">
        <div className="lg:flex h-screen">
          <section className={styles.heroBox}>
            <nav className={styles.navBar}>
              {/* <a className={styles.navBarItem} href="#overview">
                Overview
              </a>
              <a className={styles.navBarItem} href="#features">
                Features
              </a>
              <a className={styles.navBarItem} href="#integrations">
                Integrations
              </a> */}
              <a className={styles.navBarItem} href="#developers">
                Developers
              </a>
            </nav>
            <div className="md:h-screen m-4 lg:ml-32 lg:mr-16 flex-1 flex flex-col justify-center">
              <div className="">
                <h1 className="text-headline2 font-bold">
                  <ServiceName />
                </h1>
                <div className="mt-8 text-headline4">
                  <span className="block">
                    A <span id="subheaderText">{contents}</span>
                  </span>
                  and so much more.
                </div>
                {/* <Button
                  className={classes.ctaButton}
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/app"
                >
                  Try a demo
                </Button> */}
                <div className="py-2 mt-2 font-bold text-headline6 text-orange-400">
                  Coming Soon™
                </div>
                <noscript>
                  <div>The demo requires JavaScript. Please enable it to continue.</div>
                </noscript>
              </div>
            </div>
          </section>
          <section className="h-full lg:flex-1">
            <LandingToolbar />
            <div className="overflow-x-hidden whitespace-nowrap">
              {/* TODO: Scripted drag and drop: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/sensors/sensor-api.md */}
              <DragDropContext sensors={[demoSensor]} onDragEnd={() => undefined}>
                <div className="">
                  <SemesterBlockList
                    semesters={samplePlan.semesters}
                    direction={ScrollDirection.horizontally}
                    enabled={false}
                    focusedSemester={samplePlan.semesters[0].code}
                  />
                </div>
              </DragDropContext>
            </div>
          </section>
        </div>
      </div>
      {/* TODO: Have the cards from first section scroll into this section */}
      {/* <section className="max-h-screen max-w-screen">
        <p className="my-4 p-4">
          <div className="my-2">Comet Planning:</div>
          <div className="my-2">The Degree Planner</div>
        </p>
      </section>
      <section className="h-full w-full">
      </section> */}
      <section id="developers" className="h-full w-full flex">
        {/* Team */}
        <section className="px-4 lg:px-16 xl:px-32 py-4 lg:py-8 xl:py-16 bg-yellow-500 flex-1">
          <div className="mb-8">
            <div className="text-headline3 font-bold">Contributors</div>
            <div className="text-subtitle1 my-2">
              Comet Planning was built by this lovely group of students:
            </div>
          </div>
          <div>
            <div className="text-headline6 font-bold mt-8 mb-4">Current maintainers</div>
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-8 xl:gap-16">
              {generateProfiles(currentMaintainers)}
            </div>
            {/* <div className="text-headline6 font-bold mt-8 mb-4">Former maintainers</div>
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-8 xl:gap-16">
              {generateProfiles(pastMaintainers)}
            </div> */}
          </div>
        </section>
        <section className="px-32 py-16 flex-1 flex flex-col justify-center">
          <div className="my-auto">
            <div className="text-body1">
              Comet Planning is maintained by ACM Development, a division of ACM UTD, a registered
              student organization. Comet Planning is not an official platform of UT Dallas and does
              not represent the views of the university or its officers.
            </div>
            <div className="text-body1 font-bold my-8">
              The Comet Planning team highly recommends that students consult their academic
              advisors, financial aid counselors, when planning their studies.
            </div>
            <div className="text-subtitle1 my-8">
              To contribute to this project and others, consider applying as a developer for{' '}
              <a className="font-bold text-blue-400 underline" href="https://acmutd.co/apply">
                ACM Development
              </a>
              !
            </div>
            <img src="/img/acm-development-banner.png" />
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}
