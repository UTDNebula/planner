import React from 'react';
import { Link } from 'react-router-dom';
import ServiceName from './ServiceName';

/**
 * A header to be used on non-app pages.
 *
 * TODO: Unify with main AppToolbar
 */
export default function MarketingHeader(): JSX.Element {
  return (
    <header className="px-2 py-3 bg-yellow-500 flex sticky shadow-lg top-0">
      <Link
        className="m-2 flex-1 flex flex-col justify-center text-headline6 text-black font-bold"
        to="/"
      >
        <ServiceName />
      </Link>
      <div className="flex flex-col justify-center">
        <Link
          className="px-4 rounded-md hover:bg-gray-300 py-2 text-button font-bold uppercase"
          to="/auth/signIn"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
