import React from "react";
import Link from "next/link";
import ServiceName from "./ServiceName";

/**
 * A header to be used on non-app pages.
 *
 * Note: UNUSED
 * TODO: Either use or remove for Planner v1
 * TODO: Unify with main AppToolbar
 */
export default function MarketingHeader(): JSX.Element {
  return (
    <header className="px-2 py-3 bg-yellow-500 flex sticky shadow-lg top-0">
      <Link href="/">
        <div className="m-2 flex-1 flex flex-col justify-center text-headline6 text-black font-bold">
          <ServiceName />
        </div>
      </Link>
      <div className="flex flex-col justify-center">
        <Link href="/auth/signIn">
          <div className="px-4 rounded-md hover:bg-gray-300 py-2 text-button font-bold uppercase">
            Sign in
          </div>
        </Link>
      </div>
    </header>
  );
}
