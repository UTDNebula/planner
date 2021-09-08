import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React from 'react';

//Array of Majors/Minors to chose from
const subjects = ['Computer Science', 'Biology', 'Gender Studies'];

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

export default function PageOne(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <h2 className="text-3xl text-center font-bold mb-10 text-gray-800">
          Tell us about Yourself
        </h2>
        <h3 className="text-2xl text-center font-bold mb-10 text-gray-800">What is your name?</h3>
        <div className="flex items-center justify-center">
          <input
            type="text"
            className="mb-10 border bg-blue-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-blue-600 rounded"
            placeholder="Your name"
          />
        </div>
        <div className="flex justify-center mx-2 items-center flex-col w-22">
          <h1 className="text-2xl text-center font-bold mb-10 text-gray-800">
            Student Classification?
          </h1>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Freshman
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Sophomore{' '}
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Junior
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Senior
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Super-Senior
          </button>
        </div>

        <h3 className="text-2xl text-center font-bold mb-5 text-gray-800">
          Will you be attending UTD on campus?
        </h3>
        <div className="flex items-center mb-10 justify-center">
          <button className="bg-transparent mr-10 hover:bg-yellow-500 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded">
            YES
          </button>
          <button className="bg-transparent ml-10 hover:bg-yellow-500 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded">
            NO
          </button>
        </div>
        <h3 className="text-2xl text-center font-bold mb-10 text-gray-800">
          Are you recieving any school-provided scholarships?
        </h3>
        <div className="flex items-center mb-10 justify-center">
          <button className="bg-transparent mr-10 hover:bg-yellow-500 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded">
            YES
          </button>
          <button className="bg-transparent ml-10 hover:bg-yellow-500 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded">
            NO
          </button>
        </div>
        <h3 className="text-2xl text-center font-bold mb-10 text-gray-800">
          Are you recieving financial aid?
        </h3>
        <div className="flex items-center mb-10 justify-center">
          <button className="bg-transparent mr-10 hover:bg-yellow-500 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded">
            YES
          </button>
          <button className="bg-transparent ml-10 hover:bg-yellow-500 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded">
            NO
          </button>
        </div>
        <h3 className="text-2xl text-center font-bold mb-10 text-gray-800">
          What are you studying?
        </h3>
        <div className="flex items-center mb-10 justify-center">
          <FormControl>
            <InputLabel shrink={true} id="grade">
              Subject
            </InputLabel>
            <Select labelId="grade" id="grade" value={0} name="grade">
              {returnMenuItems(subjects)}
            </Select>
          </FormControl>
          <div className="inline-flex">
            <div className="ml-20">
              <div className="mb-4">
                <div className="max-w-lg h-24 w-72 rounded-lg shadow-lg border border-blue-600 p-5 ">
                  <div className="grid grid-cols-1 divide-y divide-blue-600">
                    <div className="inline-flex">
                      <h3 className="font-semibold mr-20 text-lg text-gray-700 ">Subject</h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 -my-2 ml-20 fill-current text-blue-600"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-grey-800"> </div>
                  </div>
                  <p className="text-gray-500 mt-1 my-1">Type of Degree</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="max-w-lg h-24 w-72 rounded-lg  shadow-lg border border-blue-600 p-5 ">
                  <div className="grid grid-cols-1 divide-y divide-blue-600">
                    <div className="inline-flex">
                      <h3 className="font-semibold mr-20 text-lg text-gray-700 ">Subject</h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 -my-2 ml-20 fill-current text-blue-600"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-grey-800"> </div>
                  </div>
                  <p className="text-gray-500 mt-1 my-1">Type of Degree</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="max-w-lg h-24 w-72 rounded-lg shadow-lg border border-blue-600 p-5">
                  <div className="grid grid-cols-1 divide-y divide-blue-600">
                    <div className="inline-flex">
                      <h3 className="font-semibold mr-20 text-lg text-gray-700 ">Subject</h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 -my-2 ml-20 fill-current text-blue-600"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-grey-800"> </div>
                  </div>
                  <p className="text-gray-500 mt-1 my-1">Type of Degree</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
