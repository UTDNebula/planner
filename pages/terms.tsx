import Link from 'next/link';
import React from 'react';
import Footer from '../components/common/Footer';
import MarketingHeader from '../components/common/MarketingHeader';
import ServiceName from '../components/common/ServiceName';

/**
 * A terms of service for the app.
 */
export default function TermsPage(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow-md">
          <header className="px-4 pt-4 md:px-8 md:pt-8">
            <span className="block text-headline5 font-bold">Terms of Service</span>
            <span className="block mt-1 text-subtitle1 text-gray-500">
              Last updated January 18, 2021
            </span>
          </header>
          <main className="pt-2 px-4 pb-4 md:pt-4 md:px-8 md:pb-8">
            <div>
              <h1 className="text-headline6 my-4">TL;DR</h1>
              <p className="text-body1">
                The Project Nebula maintainers hope that you read all these relatively short terms
                of service, but here are the highlights:
              </p>
              <ul className="list-disc list-inside px-2">
                <li className="py-1 text-subtitle1">
                  You are not required to use an account, but some features are only available to
                  users with an account.
                </li>
                <li className="py-1 text-subtitle1">
                  <ServiceName /> is open-source, but don&apos;t hack into our systems in bad faith.
                  If you do this, we may suspend your access to your account.
                </li>
                <li className="py-1 text-subtitle1">
                  Usage of the data you provide us is governed by our{' '}
                  <Link href="/privacy">
                    <span className="text-blue-500 font-bold">
                      Privacy Policy
                    </span>
                  </Link>
                  .
                </li>
                <li className="py-1 text-subtitle1">
                  This is a student project maintained by ACM UTD, a registered student organization
                  at The University of Texas at Dallas. Nebula Web is not an official service of UT
                  Dallas and does not represent the views of the university or its officers.
                </li>
              </ul>
            </div>
            <h1 className="text-headline6 my-4">What is inside these terms?</h1>
            <p className="py-2 text-body1">
              These terms of service outline what you should expect from the maintainers of this
              project and what we, the maintainers, expect from you, the user.
            </p>
            <h1 className="text-headline6 my-4">Definitions</h1>
            <p className="py-2 text-body1">
              These definitions will be used throughout these terms:
            </p>
            <ul className="list-disc list-inside px-2">
              <li className="py-1">
                <b className="font-bold">App:</b> Nebula Web, the software tool that allows
                individuals to plan their college experience.
              </li>
              <li className="py-1">
                <b className="font-bold">Account:</b> A record associated with a person that is
                stored in the Comet Data Service.
              </li>
              <li className="py-1">
                <b className="font-bold">User:</b> A person who has an account with the Comet Data
                Service.
              </li>
              <li className="py-1">
                <b className="font-bold">Service:</b> The{' '}
                <a href="https://comet-data-service.web.app">Comet Data Service,</a> the electronic
                technical infrastructure used to maintain services including, but not limited to,
                the App.
              </li>
              <li className="py-1">
                <b className="font-bold">Student:</b> A person enrolled at a university supported by
                the App.
              </li>
              <li className="py-1">
                <b className="font-bold">Project Nebula Maintainers (Maintainers):</b> A group of
                studnets officers in ACM Development, a division of the Association for Computing
                Machinery at The University of Texas at Dallas.
              </li>
              <li className="py-1">
                <b className="font-bold">Admin:</b> A trusted User who has access to User data.
              </li>
              <li className="py-1">
                <b className="font-bold">Admin Console:</b> The interface through which a Maintainer
                or Admin can access User data and manage Service functionality.
              </li>
              <li className="py-1">
                <b className="font-bold">Hacking:</b> The accessing of without the permission of the
                owner of that system
              </li>
            </ul>
            <h1 className="text-headline6 my-4">About the service</h1>
            <h2 className="text-subtitle1 font-bold mt-2">Your Account</h2>
            <p className="py-2 text-body1">
              {/* TODO: Rewrite because this is unclear. */}
              All of your user information is stored locally on your machine. Anyone who has
              physical access to your computer may be able to access your Nebula Web data.
            </p>
            <p className="py-2 text-body1">
              Although an account is not required to use core App functionality, you can create one
              to enable additional service functionality:
            </p>
            <ul className="list-disc list-inside px-2">
              <li className="py-1">Backing up plan data to view on other machines</li>
              <li className="py-1">Viewing course popularity</li>
              <li className="py-1">Sharing a plan via link</li>
            </ul>
            <p className="py-2 text-body1">
              If you believe someone may have obtained unauthorized access to your account, let the
              Maintainers know by emailing{' '}
              <a href="mailto:nebula-maintainers@acmutd.co">nebula-maintainers@acmutd.co</a> with
              the subject line &quot;Need Help with Unauthorized Account Access&quot;.
            </p>
            <h2 className="text-subtitle1 font-bold mt-2">Service Termination</h2>
            <p className="py-2 text-body1">
              If the App shuts down, you will be given until the end of the next academic semester
              or sixty (60) calendar days after a public announcement is made to download your
              Account data.
            </p>
            <p className="py-2 text-body1">
              If the Maintainers transfer ownership of the App or the Service to another entity,
              that entity will be required to uphold these terms until at least a calendar year
              (365) days after the date of transfer.
            </p>
            <h2 className="text-subtitle1 font-bold mt-2">Unauthorized access</h2>
            <p className="py-2 text-body1">
              Nebula Web is an open-source project, so its code is publicly accessible. However, the
              Admin Console is not. If the Maintainers detect you are trying to hack into the App or
              Service in bad faith, your Account may be suspended or deleted.
            </p>
            <h1 className="text-headline6 my-4">Disclaimer of liability</h1>
            <p className="py-2 text-body1">Because we should probably say this:</p>
            <p className="py-2 text-body2">
              The software is provided &apos;as is&apos;, without warranty of any kind, express or
              implied, including but not limited to the warranties of merchantability, fitness for a
              particular purpose and noninfringement. In no event shall the authors or copyright
              holders be liable for any claim, damages or other liability, whether in an action of
              contract, tort or otherwise, arising from, out of or in connection with the software
              or the use or other dealings in the software.
            </p>
            <h1 className="text-headline6 my-4">Contact</h1>
            <p className="py-2 text-body1">
              We welcome all feedback! If you would like to get in touch with us, there are a few
              options:
            </p>
            <ul className="list-disc list-inside px-2">
              <li className="py-1">
                <b className="font-bold">Feature requests and bug reports:</b>{' '}
                <a className="text-blue-400" href="https://github.com/acmutd/comet-planning/issues">
                  GitHub Issues
                </a>
              </li>
              <li className="py-1">
                <b className="font-bold">Casual discussion:</b>{' '}
                <a className="text-blue-400" href="https://acmutd.co/discord">
                  ACM Discord&nbsp;
                </a>
                (in #nebula-general)
              </li>
              <li className="py-1">
                <b className="font-bold">General inquiries to the Maintainers:</b>{' '}
                <a className="text-blue-400" href="mailto:nebula-maintainers@acmutd.co">
                  nebula-maintainers@acmutd.co
                </a>
              </li>
            </ul>
            <p className="py-2 text-body2">
              If you don&apos;t know where to begin, start with the ACM Discord.
            </p>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
