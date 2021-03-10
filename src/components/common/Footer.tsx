import React from 'react';
import { Link } from 'react-router-dom';
import ServiceName from './ServiceName';

/**
 * A footer that displays useful site links.
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="bg-gray-700 text-gray-200">
      <div className="max-w-6xl mx-auto md:grid md:grid-cols-3 md:grid-gap-2 lg:grid-gap-4 ">
        <div className="p-4">
          <h1 className="text-subtitle1 py-2 font-semibold text-gray-100">Academic Resources</h1>
          <ul className="mt-2">
            <li>
              <a href="https://www.utdallas.edu/finaid/">Office of Financial Aid</a>
            </li>
            <li>
              <a href="https://bursar.utdallas.edu/">Bursar Office</a>
            </li>
          </ul>
          <ul className="mt-2">
            <li>
              <a href="https://engineering.utdallas.edu/engineering/academics/undergraduate-majors/undergrad-advising/">
                ECS Advising
              </a>
            </li>
            <li>
              <a href="https://bbs.utdallas.edu/advising/">BBS Advising</a>
            </li>
            <li>
              <a href="https://jindal.utdallas.edu/advising/">JSOM Advising</a>
            </li>
            <li>
              <a href="https://nsm.utdallas.edu/advising/">NSM Advising</a>
            </li>
            <li>
              <a href="https://is.utdallas.edu/contact/advisors/">IS Advising</a>
            </li>
            <li>
              <a href="https://atec.utdallas.edu/people/#_people-advisors">ATEC Advising</a>
            </li>
          </ul>
          <ul className="mt-2">
            <li>
              <a href="https://www.utdallas.edu/veterans/">Military and Veteran Center</a>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <h1 className="text-subtitle1 py-2 font-semibold text-gray-100">
            <ServiceName /> Info
          </h1>
          <ul>
            <li>
              <Link to="/">Landing</Link>
            </li>
            <li>
              <Link to="/app">App Home</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/support">Self-Service Support (Coming soon)</Link>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <h1 className="text-subtitle1 py-2 font-semibold text-gray-100">ACM and Co.</h1>
          <ul>
            <li>
              <a href="https://github.com/acmutd">Other ACM Development Projects</a>
            </li>
            <li>
              <a href="https://github.com/acmutd/nebula-web">Nebula Web on GitHub</a>
            </li>
            <li>
              <a href="https://github.com/acmutd/nebula-data-service">The Nebula Data Service</a>
            </li>
            <li>
              <a href="https://acmutd.co">ACM UTD website</a>
            </li>
            <li>
              <a href="https://apply.acmutd.co/">Application to join the team</a>
            </li>
            <li>
              <a href="https://github.com/acmutd/nebula-planning/blob/develop/CONTRIBUTING.md">
                How to contribute
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4 font-semibold text-center text-caption bg-gray-800">
        Built with ❤️ and 💻 by ACM Development
      </div>
    </footer>
  );
}
