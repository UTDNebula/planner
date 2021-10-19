import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React from 'react';
import { useRouter } from 'next/router';
import Navigation, { NavigationStateProps } from '../../components/onboarding/Navigation';

// Array of values to choose from for form
const subjects = ['Computer Science', 'Biology', 'Gender Studies'];

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  // TODO: Place in utils file
  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

export default function PageFour(): JSX.Element {
  const router = useRouter();
  const navState: NavigationStateProps = { personal: false, honors: false, credits: true };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="py-16 px-32 rounded shadow-2xl w-2/3 bg-white animate-intro">
        <Navigation navigationProps={navState} />
        <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">Any Transfer Credits?</h2>
        <div className="column-flex">
          <div className="flex items-center justify-center">
            <div className="max-w-xl w-full rounded-lg shadow-lg p-4 colum-flex md:flex-row flex-col">
              <h2 className="text-xl text-center font-semibold m-5 mb-10 text-gray-800">
                Transfer Credit Conversion Tool
              </h2>
              <div className="flex items-center mb-10 justify-center space-x-20">
                <FormControl>
                  <InputLabel shrink={true} id="grade">
                    Subject
                  </InputLabel>
                  <Select labelId="grade" id="grade" value={0} name="grade">
                    {returnMenuItems(subjects)}
                  </Select>
                </FormControl>

                <div className="inline-flex">
                  <div>
                    <div className="max-w-lg w-80 bg-yellow-100 rounded-lg shadow-lg border-b border-yellow-500 p-2 ">
                      <div className="inline-flex">
                        <div className="column-flex">
                          <h3 className="font-semibold mr-32 text-lg text-gray-700 ">
                            Course Code
                          </h3>
                          <p className="text-gray-500 mt-1 my-1">Course Name</p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-4 h-6 w-6 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="orange"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="max-w-lg w-80 bg-yellow-100 rounded-lg shadow-lg border-b border-yellow-500 p-2 ">
                      <div className="inline-flex">
                        <div className="column-flex">
                          <h3 className="font-semibold mr-32 text-lg text-gray-700 ">
                            Course Code
                          </h3>
                          <p className="text-gray-500 mt-1 my-1">Course Name</p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-4 h-6 w-6 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="orange"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="max-w-lg w-80 bg-yellow-100 rounded-lg shadow-lg border-b border-yellow-500 p-2 ">
                      <div className="inline-flex">
                        <div className="column-flex">
                          <h3 className="font-semibold mr-32 text-lg text-gray-700 ">
                            Course Code
                          </h3>
                          <p className="text-gray-500 mt-1 my-1">Course Name</p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-4 h-6 w-6 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="orange"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <button
            className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
            onClick={() => router.push('/Onboarding_Pages/pg_2')}
          >
            BACK
          </button>
          <button
            className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
            disabled={false} // TODO: Disable button till all options are selected
            onClick={() => router.push('/app')}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
