import React from 'react';
import Footer from '../components/common/Footer';
import MarketingHeader from '../components/common/MarketingHeader';
import ServiceName from '../components/common/ServiceName';

/**
 * A page that details how to get support for using the app.
 *
 * TODO: Turn into a basic tutorial and self-service help desk.
 */
export default function SupportPage(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow-md">
          <header className="px-4 pt-4 md:px-8 md:pt-8">
            <span className="block text-headline5 text-center font-bold">
              <ServiceName /> Support
            </span>
          </header>
          <main className="pt-2 px-4 pb-4 md:pt-4 md:px-8 md:pb-8">
            <div className="py-4 text-headline6 text-center">Coming soon(tm)!</div>
            <p className="py-2 text-body1">
              In the meantime, you can contact the maintainers at{' '}
              <a className="text-blue-500 font-bold" href="mailto:nebula-maintainers@acmutd.co">
                nebula-maintainers@acmutd.co
              </a>
              .
            </p>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
