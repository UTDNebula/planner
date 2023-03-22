import { trpc } from '@/utils/trpc';
import router from 'next/router';
import { useState } from 'react'; //nprogress module
import AutoCompleteMajor from '@/pages/auth/AutoCompleteMajor';
import { Page } from './Page';
import useSearch from '../search/search';
import React from 'react';

export default function TemplateView({ onDismiss }: { onDismiss: () => void }) {
  const utils = trpc.useContext();

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: templatesData, isLoading, isError } = trpc.template.getAllTemplates.useQuery();

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

  React.useEffect(() => {
    updateQuery('');
  }, [isLoading]);

  if (isError) {
    console.error('Error fetching templates');
    return <div>Error fetching templates</div>;
  }

  if (!templatesData) {
    return <div>Loading...</div>;
  }

  const orderedTemplate = templatesData.sort((a, b) => {
    if (a.name! < b.name!) {
      return -1;
    }
    return 1;
  });

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
          onClick: () => handleTemplateCreation(name, major),
          color: 'primary',
          loading,
        },
      ]}
    >
      <p className="text-sm font-semibold">Plan Name</p>
      <input
        className="w-full rounded-md border border-neutral-500 py-3 px-4 text-sm text-black/80 placeholder:text-neutral-400"
        placeholder="Name your plan"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p className="text-sm font-semibold">Search degree template</p>
      <div className="relative mb-4">
        <AutoCompleteMajor
          className="w-[500px] rounded border outline-none"
          key={0}
          onValueChange={(value) => setMajor(value)}
          onInputChange={(query: string) => updateQuery(query)}
          options={results.map((major: { filMajor: string }) => major.filMajor)}
          autoFocus
        ></AutoCompleteMajor>
      </div>
    </Page>
  );
}
