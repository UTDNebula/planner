interface HomeNavbarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function HomeNavbar({ open, setOpen }: HomeNavbarProps) {
  return (
    <div
      className={`relative transform duration-200 flex z-0 bg-gray-500 last:align-right ${
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
          <span className="text-md font-semibold self-end text-white dark:text-gray-200">Home</span>
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
  );
}
