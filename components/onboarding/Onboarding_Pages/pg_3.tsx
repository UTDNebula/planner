import React from "react";
import TransferCreditGallery, { CreditState } from "../TransferCreditGallery";

export type PageThreeTypes = {
  creditState: CreditState[];
};

export type Page3Props = {
  handleChange: React.Dispatch<React.SetStateAction<PageThreeTypes>>;
  props: PageThreeTypes;
  handleValidate: (value: boolean) => void;
};

export default function PageThree({
  handleChange,
  props,
}: Page3Props): JSX.Element {
  const { creditState } = props;

  const handleTransferChange = (credits: CreditState[]) => {
    handleChange({ creditState: credits });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-intro w-full">
      <div className="text-4xl text-left font-bold mb-10 text-gray-800">
        <div className="">Transfer Credits </div>
      </div>

      <TransferCreditGallery
        creditState={creditState}
        handleChange={handleTransferChange}
      />
    </div>
  );
}
