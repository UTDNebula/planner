import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React from 'react';

export default function PageThree(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <div className="flex justify-center mx-2 items-center mb-20 flex-col w-22">
          <h1 className="text-3xl font-bold mt-20 mb-20 ">Are you in any honors programs?</h1>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Collegium V Honors
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Computer Science Honors
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Liberal Arts Honors
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Behavioral and Brain Sciences Honors
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Arts and Humanities Honors
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            Economic, Political, and Policy Sciences Honors
          </button>

          <button className="w-3/5 h-10 px-6 text-gray-700 bg-blue-100 block border-0 border-b-2 border-blue-500 hover:bg-yellow-500 text-gray-800 transition-colors duration-150 rounded-lg focus:shadow-outline mb-6">
            None
          </button>
        </div>
      </div>
    </div>
  );
}
