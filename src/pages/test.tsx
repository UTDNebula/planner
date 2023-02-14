import { Course } from '@/components/planner/types';
import reqOutput from '@data/test_degree.json';

type DegreeRequirements = {
  can_graduate: boolean;
  requirements: DegreeRequirement[];
};
type DegreeRequirement = {
  name: string;
  type: string;
  requirements: RequirementGroupTypes[];
};

interface Requirement {
  matcher: string;
  metadata: { [key: string]: string };
}
type AndRequirementGroup = Requirement & {
  matcher: 'And';
  requirements: RequirementTypes[];
  filled: boolean;
};

type FreeElectiveRequirementGroup = Requirement & {
  matcher: 'FreeElectives';
  required_hours: number;
  fulfilled_hours: number;
  excluded_courses: string[];
  valid_courses: string[];
};

type CSGuidedElectiveGroup = Requirement & {
  matcher: 'CS Guided Elective';
  required_count: number;
  also_fulfills: string[];
  starts_with: string;
  fulfilled_count: number;
  valid_courses: string[];
};
// type Requirement = { matcher: string; filled: boolean };

type CourseRequirement = {
  matcher: 'course';
  course: string;
};

type RequirementGroupTypes =
  | AndRequirementGroup
  | FreeElectiveRequirementGroup
  | CSGuidedElectiveGroup;

type RequirementTypes = CourseRequirement | OrRequirement | AndRequirementGroup;

type OrRequirement = Requirement & {
  matcher: 'Or';
  requirements: RequirementTypes[];
};

export default function Test() {
  const data: DegreeRequirements = reqOutput as DegreeRequirements;
  return (
    <div className="flex h-full w-[300px] flex-col items-center border-2">
      <div className="text-xl">Your Requirements</div>
      {data.requirements.map((degreeReq, idx) => (
        <DegreeRequirement degreeReq={degreeReq} key={idx} />
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
    <div className="w-full rounded-md border-2 border-black">
      <div className="">
        <span>{degreeReq.name} </span>
        <span>{degreeReq.type}</span>
      </div>
      {degreeReq.requirements ? (
        degreeReq.requirements.map((reqTest, idx) => (
          <RequirementGroup reqGroup={reqTest} key={idx} />
        ))
      ) : (
        <div>NOT SUPPORTED</div>
      )}
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
        return <div>CS Guided Elective</div>;
    }
  };

  return (
    <div>
      <div>{reqGroup.metadata?.name}</div>
      {getRequirementGroup()}
    </div>
  );
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
            <div>Or</div>
            <div className="">
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup key={idx} req={req2} />
              ))}
            </div>{' '}
            {/* This should be accordian wrapper */}
          </div>
        );
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
