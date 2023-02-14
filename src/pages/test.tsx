import reqOutput from '@data/test_degree.json';

export type DegreeRequirements = {
  can_graduate: boolean;
  requirements: DegreeRequirement[];
};
export type DegreeRequirement = {
  name: string;
  type: string;
  requirements: RequirementGroupTypes[];
};

export interface Requirement {
  matcher: string;
  metadata: { [key: string]: string };
}
export type AndRequirementGroup = Requirement & {
  matcher: 'And';
  requirements: RequirementTypes[];
  filled: boolean;
};

export type FreeElectiveRequirementGroup = Requirement & {
  matcher: 'FreeElectives';
  required_hours: number;
  fulfilled_hours: number;
  excluded_courses: string[];
  valid_courses: string[];
};

export type CSGuidedElectiveGroup = Requirement & {
  matcher: 'CS Guided Elective';
  required_count: number;
  also_fulfills: CourseRequirement[];
  starts_with: string;
  fulfilled_count: number;
  valid_courses: string[];
};
// type Requirement = { matcher: string; filled: boolean };

export type CourseRequirement = {
  matcher: 'course';
  course: string;
};

export type RequirementGroupTypes =
  | AndRequirementGroup
  | FreeElectiveRequirementGroup
  | CSGuidedElectiveGroup;

export type RequirementTypes = CourseRequirement | OrRequirement | AndRequirementGroup;

export type OrRequirement = Requirement & {
  matcher: 'Or';
  requirements: RequirementTypes[];
};

export default function Test() {
  const data: DegreeRequirements = reqOutput as DegreeRequirements;
  return (
    <div className="flex w-[300px] flex-col items-center border-2">
      <div className="text-xl">Your Requirements</div>
      {data.requirements.map((degreeReq, idx) => (
        <AccordianWrapper name={degreeReq.name} key={idx}>
          <DegreeRequirement degreeReq={degreeReq} />
        </AccordianWrapper>
      ))}
    </div>
  );
}

/**
 * DegreeRequirement component displays a unique degree requirement at UTD
 *  i.e. Core Curriculum, Computer Science Major
 * @param param0
 * @returns
 */
function DegreeRequirement({ degreeReq }: { degreeReq: DegreeRequirement }) {
  return (
    <div className=" w-full rounded-md border-2 border-black">
      {degreeReq.requirements ? (
        degreeReq.requirements.map((reqTest, idx) => (
          <AccordianWrapper name={reqTest.metadata.name} key={idx}>
            <RequirementGroup reqGroup={reqTest} />
          </AccordianWrapper>
        ))
      ) : (
        <div>NOT SUPPORTED</div>
      )}
    </div>
  );
}

function CSGuidedElectiveComponent({ req }: { req: CSGuidedElectiveGroup }) {
  return (
    <div>
      Completed Courses:
      {req.valid_courses.map((course, idx) => (
        <div key={idx}>{course}</div>
      ))}
      Select Courses:
      {req.also_fulfills.map((course, idx) => (
        <CourseRequirement key={idx} req={course} />
      ))}
    </div>
  );
}
/**
 * Group of Requirements
 * i.e. Major Preparatory Courses, Free Electives
 * @param param0
 * @returns
 */
function RequirementGroup({ reqGroup }: { reqGroup: RequirementGroupTypes }) {
  const getRequirementGroup = () => {
    switch (reqGroup.matcher) {
      case 'And':
        return reqGroup.requirements.map((req, idx) => (
          <RecursiveRequirementGroup key={idx} req={req} />
        ));
      case 'FreeElectives':
        return <div>Free Elective</div>;
      case 'CS Guided Elective':
        return <CSGuidedElectiveComponent req={reqGroup} />;
    }
  };

  return <div>{getRequirementGroup()}</div>;
}

/**
 * Group of requirements that's recursive?
 * @param param0
 * @returns
 */
function RecursiveRequirementGroup({ req }: { req: RequirementTypes }) {
  const getRequirement = () => {
    switch (req.matcher) {
      case 'course':
        return <CourseRequirement req={req} />;
      case 'Or':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={req.matcher}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup key={idx} req={req2} />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'And':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={req.matcher}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup key={idx} req={req2} />
              ))}
            </AccordianWrapper>
          </div>
        );
      default:
        return <div>NOT SUPPORTED</div>;
    }
  };
  return <>{getRequirement()}</>;
}

function CourseRequirement({ req }: { req: CourseRequirement }) {
  return (
    <div>
      <div>{req.course}</div>
    </div>
  );
}

/**
 * TODO: Make this custom because it's causing annoying behaviors
 * @param param0
 * @returns
 */
function AccordianWrapper({ name, children }: { name: string; children: any }) {
  return (
    <div className="collapse-arrow collapse border-2 border-pink-500" tabIndex={0}>
      <input type="checkbox" className="border-32 border-orange-500" />
      <div className="collapse-title">{name}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
