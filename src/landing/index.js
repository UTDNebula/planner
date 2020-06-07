import React from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Comet Planner</p>
        <p>Coming soon.</p>
        <a
          className="App-link"
          href="https://github.com/acmutd/Development"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by ACM Development.
        </a>
        <section>
          <h1>Testing stuff</h1>
          <div>
            <Link to="/schedules">See all test schedules</Link>
          </div>
        </section>
      </header>
    </div>
  );
}