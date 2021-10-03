import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UpdatesDialog from '../../components/updates/UpdatesDialog';

export default function Privacy(): JSX.Element {
  const router = useRouter();

  // Checkbox validation to ensure user checks all boxes before moving on
  const [checked, setChecked] = React.useState([false, false, false]);
  const checkChecked = (check: boolean) => check;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-blue-400">
        <div className="bg-white p-16 rounded shadow-2xl w-2/3 animate-intro">
          <h2 className="text-3xl text-center font-bold mb-2 text-gray-800">Privacy Setting</h2>
          <h3 className="text-lg text-center font-medium mb-10">
            Before we get started, help us answer a few questions so we can get your permission
            for...
          </h3>

          <div className="flex-col items-center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked[0]}
                  onChange={() => setChecked([!checked[0], checked[1], checked[2]])}
                />
              }
              label="User Experience"
            />
            <h2 className="ml-9 mb-5 text-gray-700 text-sm">
              Allow us to collect information about you for a more personalized user experience
            </h2>
          </div>

          <div className="flex-col items-center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked[1]}
                  onChange={() => setChecked([checked[0], !checked[1], checked[2]])}
                />
              }
              label="Analytics Collection"
            />
            <h2 className="ml-9 mb-5 text-gray-700 text-sm">
              Automatically report problems/ bugs to our team so we can improve your experience
            </h2>
          </div>

          <div className="flex-col items-center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked[2]}
                  onChange={() => setChecked([checked[0], checked[1], !checked[2]])}
                />
              }
              label="Performance Data Collection"
            />
            <h2 className="ml-9 mb-7 text-gray-700 text-sm">
              Allow us to access your specific device information{' '}
            </h2>
          </div>

          <div className="mt-10 flex items-center justify-center">
            <button
              className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
              onClick={() => router.push('/Onboarding_Pages/disclaimer')}
            >
              BACK
            </button>
            <button
              className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
              disabled={!checked.every(checkChecked)}
              onClick={() => router.push('/Onboarding_Pages/pg_1')}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
