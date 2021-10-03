import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function Welcome(): JSX.Element {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white animate-intro">
      <div className="bg-white p-16 rounded  w-2/3">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to</h2>
        <h2 className="text-5xl font-bold mb-5 text-blue-400">Nebula</h2>

        <figcaption className="font-small">
          <div className="text-cyan-600 mb-10">
            Tell us about yourself so we can generate your personal planner
          </div>
        </figcaption>

        <button
          className="text-blue-500 hover:text-yellow-500 font-bold rounded "
          onClick={() => router.push('/Onboarding_Pages/disclaimer')}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
