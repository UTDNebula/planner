import 'animate.css';

import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useInView } from 'react-intersection-observer';

import AppBar from '../components/home/Onboarding/Appbar';
import DisplayLogoSection from '../components/home/Onboarding/DisplayLogoSection';
import DragAndDropSection from '../components/home/Onboarding/DragAndDropSection';
import FeatureSection from '../components/home/Onboarding/FeatureSection';
import GetStartedSection from '../components/home/Onboarding/GetStartedSection';
import LearnMoreSection from '../components/home/Onboarding/LearnMoreSection';

/**
 * The primary landing page for the application.
 *
 * This is mostly for marketing.
 *
 * TODO: Make landing page more exciting!
 * TODO: also show some lightweight interactive demos since why not.
 */

export default function LandingPage(): JSX.Element {
  const { ref: appBarRef, inView: appBarVisible } = useInView({
    triggerOnce: true,
  });

  const ref1 = React.useRef();
  const ref2 = React.useRef();
  const ref3 = React.useRef();

  return (
    <div>
      <Scrollbars style={{ height: '90vh' }}>
        <div
          ref={appBarRef}
          className={`sticky top-0 z-10 ${
            appBarVisible && 'animate__animated animate__bounce animate__slow'
          }`}
        >
          <AppBar ref1={ref1} ref2={ref2} ref3={ref3} />
        </div>
        <div ref={ref1}>
          <DisplayLogoSection />
        </div>
        <div>
          <FeatureSection ref2={ref2} />
        </div>
        <div>
          <DragAndDropSection />
        </div>
        <div>
          <GetStartedSection />
        </div>
        <div ref={ref3}>
          <LearnMoreSection />
        </div>
      </Scrollbars>
    </div>
  );
}
