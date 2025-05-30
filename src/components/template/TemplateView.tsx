import router from 'next/router';
import React, { useEffect, useState } from 'react'; //nprogress module

import AutoCompleteMajor from '@/components/AutoCompleteMajor';
import { trpc } from '@/utils/trpc';

import { Page } from './Page';
import useSearch from '../search/search';

export default function TemplateView({ onDismiss }: { onDismiss: () => void }) {
  const utils = trpc.useContext();

  const [name, setName] = useState('');
  const [major, setMajor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [planNameError, setPlanNameError] = useState(false);
  const [majorError, setMajorError] = useState(false);
  const setErrors = () => {
    setPlanNameError(name === '');
    setMajorError(major === null);
  };

  const {
    data: templatesData,
    isLoading,
    isError,
  } = trpc.template.publicGetAllTemplates.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const createTemplateUserPlan = trpc.user.createTemplateUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const { results, updateQuery } = useSearch({
    getData: async () =>
      templatesData ? templatesData.map((major) => ({ filMajor: `${major.name}` })) : [],
    initialQuery: '',
    filterFn: (major, query) => major.filMajor.toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 100],
  });

  useEffect(() => {
    updateQuery('');
  }, [isLoading]);

  if (isError) {
    console.error('Error fetching templates');
    return <div>Error fetching templates</div>;
  }

  if (!templatesData) {
    return <div>Loading...</div>;
  }

  const handleTemplateCreation = async (name: string, major: string) => {
    setLoading(true);

    const selectedTemplate = templatesData.find((t) => t.name === major);
    if (!selectedTemplate) {
      alert('Template not found. Please try again');
      setLoading(false);
      return;
    }
    try {
      const planId = await createTemplateUserPlan.mutateAsync({
        name,
        templateName: selectedTemplate.id,
      });
      if (!planId) {
        return router.push('/app/home');
      }
      return router.push(`/app/plans/${planId}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Page
      data-testid="create-template-plan-page"
      title="Select a Degree Template"
      subtitle="Find a degree template to start planning."
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
              handleTemplateCreation(name, major);
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
          onChange={(e) => setName(e.target.value)}
        />
        <small className={`${planNameError ? 'visible' : 'invisible'}  text-red-500`}>
          Please provide a plan name
        </small>
      </div>

      <p className="text-sm font-semibold">Search degree template</p>
      <div className="relative mb-4">
        <AutoCompleteMajor
          data-testid="major-autocomplete"
          className="w-[500px] outline-none"
          key={0}
          onValueChange={(value) => setMajor(value)}
          onInputChange={(query: string) => updateQuery(query)}
          options={results.map((major: { filMajor: string }) => major.filMajor)}
        ></AutoCompleteMajor>
      </div>
      <small className={`${majorError ? 'visible' : 'hidden'} -mt-6  text-red-500`}>
        Please select a valid major
      </small>
    </Page>
  );
}
