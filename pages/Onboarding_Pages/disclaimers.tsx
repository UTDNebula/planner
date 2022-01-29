import React from 'react';
import { useRouter } from 'next/router';
import Disclaimer, { ConsentInfo } from '../../components/onboarding/Disclaimer';

export default function Disclaimers(): JSX.Element {
  const router = useRouter();

  const handleDone = (info: ConsentInfo) => {
    console.log({ ...info });
    // TODO: Connect user cosent info to firebase
    router.push('/Onboarding_Pages/pg_1');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-blue-400">
        <div className="bg-white p-16 rounded shadow-2xl w-2/3 animate-intro">
          <h2 className="text-3xl text-center font-bold mb-10 text-gray-800">Disclaimer</h2>
          <Disclaimer onConsent={handleDone} />
        </div>
      </div>
    </>
  );
}
