import React from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <article>
      <p className="text-body1">
        <ServiceName /> is a student-built project maintained by the Development officers at
        <a href="https://acmutd.co">ACM UTD</a>, a registered student organization at The University
        of Texas at Dallas.
      </p>
      <p className="text-body1">
        <b className="font-bold">
          This is an unofficial tool only to be used to supplement other campus resources.
        </b>
        <ServiceName /> tries its best to help you plan out college, but sometimes it may not be
        up-to-date. When in doubt, check the{' '}
        <a href="https://catalog.utdallas.edu/now">Academic catalog</a>
        for the most current information on academic policies, and ask your academic advisors and/or
        financial aid counselors and/or scholarship office when you have a question that could
        impact your academic career.
      </p>
      <p>
        Finally, an account is not required to use this service, but having one allows more
        functionality like backing up your degree plan to the cloud and sharing a link to your plan
        with others.
      </p>

      <p className="mt-2">With all of that out of the way, let&apos;s get started!</p>
      <div>
        <h1>Personalization</h1>
        <p className="text-body1"></p>
        <h1>Analytics</h1>
        <p className="text-body1">
          We want to make planning your college experience as easy and useful as possible.
          Collecting anonymous analytics helps us power features like:
        </p>
        <ul className="text-body1">
          <li>Grade distributions</li>
          <li>Class popularity estimates</li>
        </ul>
        <p>
          Analytics help us understand which features are most used. Comet Planning does not track
          you across the web. All data you give is kept within the service and not shared with
          third-parties. By opting in, you&apos;ll help us keep Comet Planning running for a long
          time
        </p>
        <p>
          For more inforation, see our <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </article>
  );
}
