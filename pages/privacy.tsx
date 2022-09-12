import React from 'react';

import Footer from '../components/common/Footer';
import MarketingHeader from '../components/common/MarketingHeader';
import ServiceName from '../components/common/ServiceName';

/**
 * A page that outlines the app's privacy policy.
 */
export default function PrivacyPage(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow-md">
          <header className="px-4 pt-4 md:px-8 md:pt-8">
            <span className="block text-headline5 font-bold">Privacy Policy</span>
            <span className="block mt-1 text-subtitle1 text-gray-500">
              Last updated January 18, 2021
            </span>
          </header>
          <main className="pt-2 px-4 pb-4 md:pt-4 md:px-8 md:pb-8">
            <div>
              <h1 id="tldr" className="text-headline6 my-4 hover:text-blue-500">
                <a className="" href="#tldr">
                  <span className="-ml-4 text-transparent md:text-gray-200 md:hover:text-blue-500">
                    #&nbsp;
                  </span>
                  TL;DR
                </a>
              </h1>
              <p className="py-2 text-body1">
                <ServiceName /> has a very simple privacy policy: you don&apos;t have to create an
                account to use the service, but if you do, all of the data you produce is yours. The
                maintainers act as stewards of your data. Any data we do collect is used solely to
                operate or improve service functionality.
              </p>
              <p className="py-2 text-body1">Of course, keep reading for more detail.</p>

              <h1 id="collectedData" className="text-headline6 my-4 hover:text-blue-500">
                <a className="" href="#collectedData">
                  <span className="-ml-4 text-transparent md:text-gray-200 md:hover:text-blue-500">
                    #&nbsp;
                  </span>
                  Data we collect
                </a>
              </h1>
              <p className="py-1 text-subtitle2 font-bold">
                TL;DR: If you create an account, we collect your name, email address, and
                service-specific information like personalized degree plan information.
              </p>
              <h2 className="text-subtitle1 font-bold mt-2">Personal information</h2>
              <p className="py-2 text-body1">The app may ask for the following information:</p>
              <ul className="list-disc list-inside px-2">
                <li className="py-1">Preferred name</li>
                <li className="py-1">Email address</li>
                <li className="py-1">Profile picture</li>
                <li className="py-1">Date of joining the University</li>
                <li className="py-1">Course/major and minors (if applicable) of study</li>
                <li className="py-1">Long-term career plans</li>
              </ul>
              <h2 className="text-subtitle1 font-bold mt-2">Device information</h2>
              <p className="py-2 text-body1">We may collect the following data from your device:</p>
              <ul className="list-disc list-inside px-2">
                <li className="py-1">
                  Device configuration - whether your device is a mobile device, laptop, or desktop,
                  what browser you are using to access your device
                </li>
              </ul>

              <h1 id="sharedData" className="text-headline6 my-4 hover:text-blue-500">
                <a className="" href="#sharedData">
                  <span className="-ml-4 text-transparent md:text-gray-200 md:hover:text-blue-500">
                    #&nbsp;
                  </span>
                  Data we share
                </a>
              </h1>
              <p className="py-1 text-subtitle2 font-bold">
                TL;DR: We share data with our data subprocessors and only to authorized maintainers
                and admin users.
              </p>
              <h2 className="text-subtitle1 font-bold mt-2">How we share it</h2>
              <p className="py-2 text-body1">
                Data such as IP address is automatically collected by when logging error and debug
                messages from the app. This data is sent in aggregate to Firebase, one of our data
                subprocessors.
              </p>
              <h2 className="text-subtitle1 font-bold mt-2">With whom we share it</h2>
              <p className="py-2 text-body1">
                Only you, a limited subset of our maintainers and service admin may access your
                data.
              </p>
              <p className="py-2 text-body1">
                Maintainers must have a legitimate reason to access your account data in our
                database. If you request support from us, we will ask for your permission before
                sharing the most minimum amount of information needed to assist you.
              </p>
              <p className="py-2 text-body1">
                We do not sell your account information to third parties.
              </p>
              <h2 className="text-subtitle1 font-bold mt-2">Data shared in aggregate</h2>
              <p className="py-2 text-body1">
                Some information we collect may be aggregated to enhance service functionality. Such
                data is combined with other users and anonymized.
              </p>

              <h1 id="usedData" className="text-headline6 my-4 hover:text-blue-500">
                <a className="" href="#usedData">
                  <span className="-ml-4 text-transparent md:text-gray-200 md:hover:text-blue-500">
                    #&nbsp;
                  </span>
                  Data we use
                </a>
              </h1>
              <p className="py-1 text-subtitle2 font-bold">
                TL;DR: We only use your data for legitimate service functionality.
              </p>
              <h2 className="text-subtitle1 font-bold mt-2">How we share it</h2>
              <p className="py-2 text-body1">
                Data such as IP address is automatically collected by when logging error and debug
                messages from the app. This data is sent in aggregate to Firebase, one of our data
                subprocessors.
              </p>

              <h1 className="text-headline6 my-4">Data subprocessors</h1>
              <p className="py-2 text-body1">
                <ServiceName /> currently uses the following third-party products to help process
                your data and support our technical infrastructure:
              </p>
              <ul className="list-disc list-inside px-2">
                <li className="py-1">
                  Firebase (by Google)
                  <ul className="list-disc list-inside px-4">
                    <li className="pl-2">Cloud Firestore, a database solution</li>
                  </ul>
                  <ul className="list-disc list-inside px-4">
                    <li className="pl-2">
                      Firebase Authentication, an identity management product
                    </li>
                  </ul>
                  <ul className="list-disc list-inside px-4">
                    <li className="pl-2">Sign in with Google</li>
                  </ul>
                </li>
              </ul>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
