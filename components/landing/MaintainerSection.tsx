type Maintainer = {
  name: string;
  role: string;
  link: string;
  image: string;
};

// TODO: Update current maintainers
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
/**
 * A description and list of project maintainers.
 * NOTE: This component is currently unused
 * TODO: Either use or remove this component by Planner v1
 */
export default function MaintainerSection() {
  return (
    <section id="developers" className="h-full w-full flex">
      {/* Team */}
      <section className="px-4 lg:px-16 xl:px-32 py-4 lg:py-8 xl:py-16 bg-yellow-500 flex-1">
        <div className="mb-8">
          <div className="text-headline3 font-bold">Contributors</div>
          <div className="text-subtitle1 my-2">
            Nebula was built by this lovely group of students:
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
      <section className="px-32 py-16 flex-1 flex flex-col justify-center bg-gray-200">
        <div className="my-auto">
          <div className="text-body1">
            Nebula is maintained by ACM Development, a division of ACM UTD, a registered student
            organization. Nebula is not an official platform of UT Dallas and does not represent the
            views of the university or its officers.
          </div>
          <div className="text-body1 font-bold my-8">
            The Nebula team highly recommends that students consult their academic advisors,
            financial aid counselors, when planning their studies.
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
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
          {/* TODO: Insert maintainers */}
        </div>
      </section>
    </section>
  );
}
