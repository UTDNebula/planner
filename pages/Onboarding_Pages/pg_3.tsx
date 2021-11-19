import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation, { NavigationStateProps } from '../../components/onboarding/Navigation';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import TransferCreditCard from '../../components/onboarding/TransferCreditCard';

import TransferCreditGallery, {
  CreditState,
} from '../../components/onboarding/TransferCreditGallery';

export type PageThreeTypes = {
  creditState: CreditState[];
};

/**
 * TODO: Create method to relay this data to Firebase
 */
function sendData(data: CreditState) {
  console.log('Page 3 data:', data);
}
const data = 0;

export type Page3Props = {
  handleChange: React.Dispatch<React.SetStateAction<PageThreeTypes>>;
  props: PageThreeTypes;
  handleValidate: (value: boolean) => void;
};

export default function PageThree({ handleChange, props }: Page3Props): JSX.Element {
  const { creditState } = props;

  const handleTransferChange = (credits: CreditState[]) => {
    handleChange({ creditState: credits });
  };

  return (
    <div className="animate-intro">
      <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">Any Transfer Credits?</h2>
      <div className="column-flex">
        <div className="flex items-center justify-center">
          <TransferCreditGallery creditState={creditState} handleChange={handleTransferChange} />
        </div>
      </div>
    </div>
  );
}
