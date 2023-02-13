import reqOutput from '@data/test_degree.json';

export default function Test() {
  console.log(reqOutput);
  return (
    <div className="flex h-full w-[300px] flex-col items-center border-2">
      <div className="text-xl">Your Requirements</div>
      {reqOutput.requirements.map((degreeReq, idx) => (
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
function DegreeRequirement({ degreeReq }) {
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
function RequirementGroup({ reqGroup }) {
  return (
    <div>
      <div>{reqGroup.metadata?.name}</div>
      {reqGroup.requirements ? (
        reqGroup.requirements.map((req, idx) => {
          return <RecursiveRequirementGroup idx={idx} req={req} />;
        })
      ) : (
        <div className="border-2 border-pink-500">
          <div>{reqGroup.valid_courses}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Group of requirements that's recursive?
 * @param param0
 * @returns
 */
function RecursiveRequirementGroup({ req }) {
  if (req.matcher === 'Or' || req.matcher === 'And') {
    return (
      <div className="border-2 border-blue-500">
        <div>{req.matcher}</div>
        {req.requirements.map((newReq, idx) => (
          <div key={idx}>
            <RecursiveRequirementGroup req={newReq} />
          </div>
        ))}
      </div>
    );
  } else {
    return <CourseRequirement req={req} />;
  }
}

function CourseRequirement({ req }) {
  return (
    <div>
      <div>{req.course}</div>
    </div>
  );
}
