import Head from 'next/head';
import Footer from '../components/common/Footer';
import React from 'react';
import Link from 'next/link';
import ServiceName from '../components/common/ServiceName';

/**
 * The primary landing page for the application.
 *
 * This is mostly for marketing.
 *
 * TODO: also show some lightweight interactive demos since why not.
 */
export default function LandingPage(): JSX.Element {
  return (
    <div className="min-w-screen min-h-screen bg-gray-800">
      <Head>
        <title>Nebula Web - A Degree Planning Tool for UTD Students</title>
        <meta
          name="description"
          content="Nebula Web is a tool that lets you plan out your academic career."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-8 bg-gray-200">
        <div className="max-w-4xl bg-white my-16 p-8 mx-auto shadow-md rounded-md text-center">
          <div className="text-headline4 font-bold">
            <ServiceName />
          </div>
          <div className="text-headline6">Tools to help you plan out your college career.</div>
          <div className="my-4">
            <button className="p-2 rounded-md shadow-md hover:shadow-lg bg-secondary font-bold text-button uppercase">
              <Link href="/app/auth/signin">Get Started 🌌</Link>
            </button>
          </div>
        </div>
      </div>
      {/* <MaintainerSection /> */}
      <Footer />
    </div>
  );
}
