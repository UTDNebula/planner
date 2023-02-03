import { Dispatch, SetStateAction } from 'react';
import Button from '../credits/Button';

export default function ChoosePlanType({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  return (
    <section className="flex flex-col">
      <h1 className="text-[40px] font-semibold">Create a New Plan!</h1>
      <div>You can either</div>
      <div>
        <div>Build your own plan</div>
        <Button onClick={() => setPage(1)}>Create Custom Plan</Button>
      </div>
      <div>OR</div>
      <div>
        <div>Select a template plan</div>
        <Button onClick={() => setPage(2)}>Template Plan</Button>
      </div>
    </section>
  );
}
