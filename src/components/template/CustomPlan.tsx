import { displaySemesterCode } from '@/utils/utilFunctions';
import { TextField, FormControl, InputLabel } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import DropdownSelect from '../credits/DropdownSelect';
import majorsList from '@data/majors.json';
import { trpc } from '@/utils/trpc';
import Button from '../credits/Button';
import { useRouter } from 'next/router';

const majors = majorsList as string[];

export default function CustomPlan({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState(majors[0]);

  const router = useRouter();
  const utils = trpc.useContext();

  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const handleSubmit = async () => {
    const planId = await createUserPlan.mutateAsync({ name, major });
    router.push(`/app/plans/${planId}`);
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-[20px] font-semibold">Create a Custom Plan</div>
      <div className="mb-10">
        <div className="mb-10 flex flex-col">
          <TextField
            name="name"
            id="outlined-basic"
            className="w-72"
            label="Plan Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <select className="select w-72" onChange={(e) => setMajor(e.target.value)}>
          <option disabled selected>
            Choose major
          </option>
          {majors.map((major, idx) => (
            <option key={idx}>{major}</option>
          ))}
        </select>
      </div>
      <Button onClick={handleSubmit}>Create Plan</Button>
      <Button onClick={() => setPage(0)}>Back</Button>
    </section>
  );
}
