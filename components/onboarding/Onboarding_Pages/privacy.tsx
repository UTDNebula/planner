import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRouter } from 'next/router';
import { ConsentInfo } from '../Disclaimer';

export type PrivacyProps = {
  handleChange: React.Dispatch<React.SetStateAction<ConsentInfo>>;
  props: ConsentInfo;
};

export default function Privacy({ props, handleChange }: PrivacyProps): JSX.Element {
  const router = useRouter();

  // Checkbox validation to ensure user checks all boxes before moving on
  const [consentState, setConsentState] = React.useState({
    personalization: props.personalization,
    analytics: props.analytics,
    performance: props.performance,
  });

  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(props, 'TEST');
    handleChange({ ...props, [event.target.name]: event.target.checked });
    setConsentState({ ...consentState, [event.target.name]: event.target.checked });
  };

  const { personalization, analytics, performance } = consentState;

  return (
    <div className="animate-intro">
      <h2 className="text-3xl text-center font-bold mb-2 text-gray-800">Privacy Setting</h2>
      <h3 className="text-lg text-center font-medium mb-10">
        Before we get started, help us answer a few questions so we can get your permission for...
      </h3>

      <div className="flex-col items-center">
        <FormControlLabel
          control={
            <Checkbox
              name="personalization"
              checked={personalization}
              onChange={handleConsentChange}
            />
          }
          label="User Experience"
        />
        <h2 className="ml-9 mb-5 text-gray-700 text-sm">
          Allow us to collect information about you for a more personalized user experience
        </h2>
      </div>

      <div className="flex-col items-center">
        <FormControlLabel
          control={<Checkbox name="analytics" checked={analytics} onChange={handleConsentChange} />}
          label="Analytics Collection"
        />
        <h2 className="ml-9 mb-5 text-gray-700 text-sm">
          Automatically report problems/ bugs to our team so we can improve your experience
        </h2>
      </div>

      <div className="flex-col items-center">
        <FormControlLabel
          control={
            <Checkbox name="performance" checked={performance} onChange={handleConsentChange} />
          }
          label="Performance Data Collection"
        />
        <h2 className="ml-9 mb-7 text-gray-700 text-sm">
          Allow us to access your specific device information{' '}
        </h2>
      </div>
    </div>
  );
}
