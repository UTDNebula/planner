import React from 'react';

export default function TopAndSidebar({
  children,
}: any): React.PropsWithChildren<React.ReactElement> {
  const [open, setOpen] = React.useState(true);
  const circumference = ((2 * 22) / 7) * 60;
  const currentSkill = {
    title: 'ClassPercentLeft',
    percent: 75,
  };
  return (
    <div className="antialiased w-screen h-screen overflow-hidden flex flex-row bg-blue-900">
      <nav
        className={`transform duration-200 z-10 w-96 bg-white text-white min-h-screen p-3 ${
          open ? 'translate-x-0 ease-in' : '-translate-x-full ease-out opacity-0'
        }`}
      >
        <div className="flex justify-between">
          <span className="font-bold text-2xl p-2">SideBar</span>
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
        {/* <!-- Circle --> */}
        <div className="pt-72">
          <section className="">
            <div className="flex items-center justify-center pr-24">
              <svg className="transform -rotate-90 w-72 h-64">
                <circle
                  cx="145"
                  cy="145"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="15"
                  fill="transparent"
                  className="text-blue-900"
                />

                <circle
                  cx="145"
                  cy="145"
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
              <span className="absolute text-4xl text-blue-900 font-semibold font-sans pb-8 pl-8 drop-shadow-xl">
                {currentSkill.percent}%
              </span>
            </div>
          </section>
        </div>
        <span className="font-sans text-4xl text-blue-900 font-semibold pl-20">Student Name</span>

        {/* <!-- Info Bubbles --> */}
        <div className=" mt-8 flex flex-col space-y-3">
          <span className="bg-blue-300 ml-20 rounded-xl font-bold text-black text-center py-1 mx-40 shadow-md">
            Sophomore
          </span>

          <span className="bg-red-200 ml-20 rounded-xl font-bold text-black text-center px-4 py-1 m-auto shadow-md">
            Cognitive Science B.S.
          </span>

          <span className="bg-green-200 ml-20 rounded-xl font-bold text-black text-center px-4 py-1 m-auto shadow-md">
            Math(minor)
          </span>
        </div>
      </nav>

      <div className="flex-grow flex flex-col">
        <div
          className={`relative transform duration-200 flex w-screen z-0 bg-gray-500 last:align-right ${
            open ? 'translate-x-0 ease-in' : '-translate-x-96 ease-out'
          } `}
        >
          <button
            onClick={() => setOpen(true)}
            className={`p-2 text-white transition-colors hover:bg-gray-600 hover:bg-gray-700 ${
              open ? 'opacity-0' : 'opacity-100'
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
          <div>
            <a
              href="#"
              className="flex items-center justify-center w-40 px-4 py-4 mt-2 space-x-1 text-md text-white transition-colors hover:bg-gray-600 hover:bg-gray-700 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-md font-semibold self-end text-white dark:text-gray-200">
                Home
              </span>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="flex items-center justify-center w-40 px-4 py-4 mt-2 space-x-1 text-md text-white transition-colors hover:bg-gray-600 hover:bg-gray-700 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-md font-semibold self-end text-white dark:text-gray-200">
                Degrees
              </span>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="flex items-center justify-center w-40 px-4 py-4 mt-2 space-x-1 text-md text-white transition-colors hover:bg-gray-600 hover:bg-gray-700 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-md font-semibold self-end text-white dark:text-gray-200">
                Profile
              </span>
            </a>
          </div>
          <div>
            <a
              href="#"
              className="flex items-center justify-center w-40 px-4 py-4 mt-2 space-x-1 text-md text-white transition-colors hover:bg-gray-600 hover:bg-gray-700 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              <span className="text-md font-semibold self-end text-white dark:text-gray-200">
                Credits
              </span>
            </a>
          </div>
        </div>
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
