import RequirementsContainer from '@/components/planner/NewCourseSelector/RequirementsContainer';
import useSearch from '@/components/search/search';
import { loadDummyCourses } from '@/modules/common/api/courses';
import SearchBar from '@components/credits/SearchBar';

// Data would be plan data I think?
export default function Test({ data }: DVResponse) {
  const { results, updateQuery, getResults, err } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  return (
    <div className="flex justify-center h-screen w-screen bg-[#F5F5F5]">
      <div className="flex flex-col gap-y-8 border-2 w-[344px]">
        {/* Search container */}
        <div className="border-2 border-black">
          <SearchBar updateQuery={updateQuery} placeholder="Search courses" />
        </div>
        <div className="border-2 border-blue-500">
          {results.map((elm, idx) => (
            <div key={idx}>{elm.catalogCode}</div>
          ))}
        </div>
        <RequirementsContainer data={data} />
      </div>
    </div>
  );
}

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

// This gets called on every request
export async function getServerSideProps() {
  // const dummySchedule = await import('@/data/tempPlan.json');

  // const body: DVRequest = {
  //   courses: dummySchedule.semesters
  //     .flatMap((s) => s.courses)
  //     .map((c) => {
  //       const split = c.catalogCode.split(' ');
  //       const department = split[0];
  //       const courseNumber = Number(split[1]);
  //       const level = Math.floor(courseNumber / 1000);
  //       const hours = Math.floor((courseNumber - level * 1000) / 100);
  //       return {
  //         name: c.catalogCode,
  //         department: department,
  //         level,
  //         hours,
  //       };
  //     }),
  //   bypasses: [],
  //   degree: 'computer_science_bs',
  // };

  // const res = await fetch(`${process.env.NEXT_PUBLIC_VALIDATION_SERVER}/validate-degree-plan`, {
  //   method: 'POST',
  //   body: JSON.stringify(body),
  //   headers: {
  //     'content-type': 'application/json',
  //   },
  // });

  // // TODO: Figure out way to sort courses in catalog order
  // const data = (await res.json()) as DVResponse;

  const validationData = (await import('@/data/dummyValidation.json'))['default'];

  const data = Object.keys(validationData).map((elm, idx) => ({
    name: elm,
    ...validationData[elm],
  }));

  console.log(data);
  // Pass data to the page via props
  return { props: { data } };
}
