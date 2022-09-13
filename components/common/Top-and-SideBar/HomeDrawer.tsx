interface HomeDrawerProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function HomeDrawer({ open, setOpen }: HomeDrawerProps) {
  const circumference = ((2 * 22) / 7) * 60;
  const currentSkill = {
    title: 'ClassPercentLeft',
    percent: 75,
  };
  return (
    <nav
      className={`transform duration-200 z-10 w-96 bg-white text-white min-h-screen p-3 ${
        open ? 'translate-x-0 ease-in' : '-translate-x-full ease-out opacity-0'
      }`}
    >
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(false)}
          className={`p-2 text-blue-900 focus:outline-none focus:bg-blue-400 hover:bg-blue-400 rounded-md ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col justify-start items-start pl-12">
        {/* <!-- Circle --> */}
        <div className="pt-16">
          <section className="">
            <div className="flex items-center justify-center">
              <svg className="w-40 h-40 ">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="15"
                  fill="transparent"
                  className="text-blue-900"
                />

                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (currentSkill.percent / 100) * circumference}
                  strokeLinecap="round"
                  className="text-green-300"
                />
              </svg>
              {/* <!--No Text Shadow, will have to add --> */}
              <span className="absolute text-4xl text-blue-900 font-semibold font-sans drop-shadow-xl">
                {currentSkill.percent}%
              </span>
            </div>
          </section>
        </div>
        <span className="font-sans text-4xl text-blue-900 font-semibold ">Student Name</span>

        {/* <!-- Info Bubbles --> */}
        <div className="flex flex-col items-start justify-start space-y-4 pt-8">
          <span className="bg-blue-300 rounded-xl font-bold text-black px-4 py-1 text-center shadow-md">
            Sophomore
          </span>

          <span className="bg-red-200 rounded-xl font-bold text-black px-4 py-1 text-center shadow-md">
            Cognitive Science B.S.
          </span>

          <span className="bg-green-200 rounded-xl font-bold text-black px-4 py-1 text-center shadow-md">
            Math(minor)
          </span>
        </div>
      </div>
    </nav>
  );
}
