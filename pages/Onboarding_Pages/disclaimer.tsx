import React, { useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConsentInfo } from '../../components/onboarding/Disclaimer';

export type DisclaimerProps = {
  handleChange: React.Dispatch<React.SetStateAction<ConsentInfo>>;
  props: ConsentInfo;
  handleValidate: (value: boolean) => void;
};

export default function Disclaimer({
  props,
  handleChange,
  handleValidate,
}: DisclaimerProps): JSX.Element {
  const router = useRouter();

  // Checkbox validation to ensure user checks all boxes before moving on
  const [checked, setChecked] = React.useState(props.disclaimer);

  const handleCheck = () => {
    setChecked(!checked);
    handleChange({ ...props, disclaimer: !checked });
  };

  useEffect(() => {
    checked ? handleValidate(true) : handleValidate(false);
  });

  return (
    <div className="animate-intro">
      <h2 className="text-3xl text-center font-bold mb-10 text-gray-800">Disclaimer</h2>

      <div>
        <blockquote>
          <p className="text-lg">
            All the information on Nebula-Web is published in good faith and for general information
            purposes only. As fellow UTDallas students, the Project Nebula team strives to ensure
            that the content on the site is up-to-date and accurate. However, please consult your
            academic advisor for official advice. We do not make any warranties about the
            completeness, reliability and accuracy of this information. Please double Any action you
            take upon the information on our website is strictly at your own risk. We are not liable
            for any losses and damages in connection with the use of our website.
          </p>
        </blockquote>
      </div>

      <FormControlLabel
        name="disclaimer"
        control={<Checkbox checked={checked} onChange={handleCheck} />}
        label="I agree to the terms and privacy."
      />
    </div>
  );
}
