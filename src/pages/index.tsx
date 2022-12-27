import 'animate.css';

import { Button, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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

  const [open, setOpen] = React.useState(true);

  const onClose = () => {
    setOpen(false);
  };

  const ref1 = React.useRef();
  const ref2 = React.useRef();
  const ref3 = React.useRef();

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Disclaimer</DialogTitle>

        <DialogContent className="flex flex-col gap-y-8">
          <DialogContentText>
            Thank you for checking out Nebula Planner beta v0.1.0. Much of what you see right now is
            subject to further change and revision. As such, we do not make any warranties about the
            completeness, reliability and accuracy of the software or information.
          </DialogContentText>
          <DialogContentText>
            Additionally, Nebula Planner and Nebula Labs as a whole is in no way affiliated with UTD
            advising. Please keep in mind that any action you take upon the information on our
            website is strictly at your own risk. We are not liable for any losses and damages in
            connection with the use of our website.
          </DialogContentText>
          <DialogContentText>
            Please consult your academic advisor for official advice.
          </DialogContentText>
          <div className="flex flex-row">
            <div className="flex-grow"></div>
            <Button className="flex justify-center items-center" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Scrollbars style={{ height: '90vh' }}>
        <div
          ref={appBarRef}
          className={`sticky top-0 z-10 ${appBarVisible && 'animate__animated animate__bounce animate__slow'
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
