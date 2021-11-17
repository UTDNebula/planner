import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function Welcome(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800">Welcome to</h2>
      <h2 className="text-5xl font-bold mb-5 text-blue-400">Nebula</h2>

      <figcaption className="font-small">
        <div className="text-cyan-600 mb-10">
          Tell us about yourself so we can generate your personal planner
        </div>
      </figcaption>
    </>
  );
}
