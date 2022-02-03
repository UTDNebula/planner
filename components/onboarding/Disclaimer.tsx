import { Button, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import ServiceName from '../common/ServiceName';

/**
 * Component properties for a Disclaimer.
 */
interface DisclaimerProps {
  /**
   * A callback triggered when the user confirms reading all service disclaimer information.
   */
  onConsent: (info: ConsentInfo) => void;
}

/**
 * Data gathered when submitting the disclaimer and consent form.
 */
export type ConsentInfo = {
  /**
   * True if the user understands that this is not an official university service.
   */
  disclaimer: boolean;

  /**
   * True if the user consents to user personalization.
   */
  personalization: boolean;

  /**
   * True if the user consents to basic analytics collection.
   */
  analytics: boolean;

  /**
   * True if the user consents to collecting performance data;
   */
  performance: boolean;
};

/**
 * A preamble before onboarding that explains the limitations of the service.
 *
 * This contains a general disclaimer for the service.
 *
 * NOTE: CURRENTLY UNUSED. However, I am keeping this in the repo because
 * the information here may be useful in the future.
 * TODO: Either use or remove this component by Planner v1
 */
export default function Disclaimer({ onConsent }: DisclaimerProps): JSX.Element {
  const [consentState, setConsentState] = React.useState({
    disclaimer: false,
    personalization: false,
    analytics: false,
    performance: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setState({ ...state, [event.target.name]: event.target.checked });
    setConsentState({ ...consentState, [event.target.name]: event.target.checked });
  };

  const handleDone = () => {
    onConsent(consentState);
  };

  const { disclaimer, personalization, analytics, performance } = consentState;
  // TODO: Collapse disclaimer when consent is given
  return (
    <article>
      <div className="max-w-4xl mx-auto py-2">
        <p className="text-body1 my-2">
          <ServiceName /> is a student-built project maintained by the Development team at&nbsp;
          <a className="text-blue-500 font-bold" href="https://acmutd.co">
            ACM UTD
          </a>
          , a registered student organization at The University of Texas at Dallas.
        </p>
        <p className="text-body2 my-2">
          <b className="font-bold">
            This is an unofficial tool only to be used to supplement other campus resources.{' '}
          </b>
          <ServiceName /> tries its best to help you plan out college, but sometimes it may not be
          up-to-date. When in doubt, check the academic{' '}
          <a className="text-blue-500 font-bold" href="https://catalog.utdallas.edu/now">
            Catalog
          </a>{' '}
          for the most current information on academic policies, and ask your academic advisors
          and/or financial aid counselors and/or scholarship office when you have a question that
          could impact your academic career.
        </p>
        <FormControlLabel
          control={<Checkbox checked={disclaimer} onChange={handleChange} name="disclaimer" />}
          label="I understand that Nebula is a student-maintained project not maintained or officially endorsed by The University of Texas at Dallas or any of its departments."
        />
        {disclaimer && (
          <p className="text-body1 my-2">With that out of the way, let&apos;s get started!</p>
        )}
      </div>

      {disclaimer && (
        <div className="py-4">
          <div className="max-w-4xl mx-auto">
            {/* TODO(onboarding): Illustrations or colors or something. No wall of text. */}
            <div className="">
              <div className="my-4">
                <h1 className="text-headline5">Personalization</h1>
                <p className="text-body1 py-1">
                  Nebula supports some functionality that lets you back up information to an
                  account:
                </p>
                <ul className="text-body1 list-disc list-inside my-1">
                  <li>Customized degree plans</li>
                  <li>Personal career goal information</li>
                  <li>Course recommendations</li>
                </ul>
                <p className="text-body1 py-1">
                  You do not have to enable personalization to use the following features:
                </p>
                <ul className="text-body1 list-disc list-inside my-1">
                  <li>Course planning</li>
                  <li>Unofficial degree validation</li>
                  <li>Exporting a plan to PDF/spreadsheet/image</li>
                </ul>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={personalization}
                      onChange={handleChange}
                      name="personalization"
                    />
                  }
                  label="I agree to let Nebula personalize my experience."
                />
                {/* TODO: Link to create an account with redirect */}
              </div>
              <div className="my-4">
                <h1 className="text-headline5">Analytics</h1>
                <p className="text-body1 py-1">
                  We want to make planning your college experience as easy and useful as possible.
                  Collecting anonymous analytics helps us power features like:
                </p>
                <ul className="text-body1 list-disc list-inside my-1">
                  <li>Grade distributions</li>
                  <li>Class popularity estimates</li>
                </ul>
                <p>
                  Analytics help us understand which features are most used. Nebula does not track
                  you across the web. All data you give is kept within the service and not shared
                  with third-parties. By opting in, you&apos;ll help us keep updating Nebula with
                  new features based on your input.
                </p>
                <p className="text-body1 py-1">
                  For more inforation, see our{' '}
                  <Link href="/privacy">
                    <span className="text-blue-500 font-bold">Privacy Policy</span>
                  </Link>
                  .
                </p>
                <FormControlLabel
                  control={
                    <Checkbox checked={analytics} onChange={handleChange} name="analytics" />
                  }
                  label="I opt into analytics collection for Nebula."
                />
              </div>
              <div className="my-4">
                <h1 className="text-headline5">Performance</h1>
                <p className="text-body1">
                  By opting into performance monitoring, the Nebula maintainers will:
                </p>
                <ul className="text-body1 list-disc list-inside my-1">
                  <li>Be able to better diagnose errors that take place in the app</li>
                  <li>Understand which app features are being used.</li>
                  <li>Class popularity estimates</li>
                  <li>Know how to guide future development of the project</li>
                </ul>
                <FormControlLabel
                  control={
                    <Checkbox checked={performance} onChange={handleChange} name="performance" />
                  }
                  label="I opt into performance monitoring for Nebula."
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="my-2">
        <Button color="primary" variant="contained" onClick={handleDone} disabled={!disclaimer}>
          Start planning
        </Button>
      </div>
    </article>
  );
}
