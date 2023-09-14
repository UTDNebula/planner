import { useRouter } from 'next/router';
import { useState } from 'react';

import AutoCompleteMajor from '@/components/AutoCompleteMajor';

import { trpc } from '@/utils/trpc';

import useMajors from '@/shared/useMajors';

import { Page } from './Page';
import { ButtonProps } from '../Button';
import useSearch from '../search/search';

export default function CustomPlan({ onDismiss }: { onDismiss: () => void }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState<string | null>(null);
  const [planNameError, setPlanNameError] = useState(false);
  const [majorError, setMajorError] = useState(false);
  const { majors, err } = useMajors();
  const setErrors = () => {
    setPlanNameError(name === '');
    setMajorError(major === null);
  };

  const router = useRouter();
  const utils = trpc.useContext();

  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const { results, updateQuery } = useSearch({
    getData: async () => (majors ? majors.map((major) => ({ filMajor: `${major}` })) : []),
    initialQuery: '',
    filterFn: (major, query) => major.filMajor.toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 100],
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (name !== '' && major !== null) {
      setLoading(true);
      const planId = await createUserPlan.mutateAsync({
        name,
        major,
        transferCredits: [],
        takenCourses: [],
      });
      router.push(`/app/plans/${planId}`);
    }
  }

  // TODO(https://nebula-labs.atlassian.net/browse/NP-85): Refactor parseTranscript.
  return (
    <Page
      data-testid="create-custom-plan-page"
      key="custom-plan-details"
      title="Create a New Plan"
      subtitle="Name your plan and choose your major"
      close={onDismiss}
      actions={[
        {
          name: 'Cancel',
          onClick: onDismiss,
          color: 'secondary',
        },
        {
          name: 'Create Plan',
          onClick: () => {
            if (name !== '' && major !== null) {
              handleSubmit();
              return;
            }

            setErrors();
          },
          color: 'primary',
          loading,
          'data-testid': 'create-plan-btn',
        },
      ]}
    >
      <p className="text-sm font-semibold">Plan Name</p>
      <div className="flex flex-col gap-2">
        <input
          data-testid="plan-name-input"
          className="w-full rounded-md border border-neutral-500 px-4 py-3 text-sm text-black/80 placeholder:text-neutral-400"
          placeholder="Name your plan"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <small className={`${planNameError ? 'visible' : 'invisible'}  text-red-500`}>
          Please provide a plan name
        </small>
      </div>

      <p className="text-sm font-semibold">Choose your major</p>
      <div className="relative mb-4">
        <AutoCompleteMajor
          data-testid="major-autocomplete"
          className="w-[500px] rounded border outline-none"
          key={0}
          onValueChange={(value) => setMajor(value)}
          onInputChange={(query: string) => updateQuery(query)}
          options={results.map((major: { filMajor: string }) => major.filMajor)}
          autoFocus
        ></AutoCompleteMajor>
      </div>
      <small className={`${majorError ? 'visible' : 'hidden'} -mt-6  text-red-500`}>
        Please select a valid major
      </small>
    </Page>
  );
}

export interface PageProps {
  title: string;
  subtitle: string;
  close: () => void;
  actions: {
    name: string;
    onClick: () => void;
    color: ButtonProps['color'];
    loading?: boolean;
    'data-testid'?: string;
    disabled?: boolean;
  }[];
}
