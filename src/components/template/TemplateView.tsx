import { trpc } from '@/utils/trpc';
import router from 'next/router';
import { useState } from 'react'; //nprogress module

import { Page } from './Page';

export default function TemplateView({ onDismiss }: { onDismiss: () => void }) {
  const utils = trpc.useContext();

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');

  const { data, isError } = trpc.template.getAllTemplates.useQuery();

  const createTemplateUserPlan = trpc.user.createTemplateUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  if (isError) {
    console.error('Error fetching templates');
    return <div>Error fetching templates</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }
  const templates = data;

  const orderedTemplate = templates.sort((a, b) => {
    if (a.name! < b.name!) {
      return -1;
    }
    return 1;
  });

  const handleTemplateCreation = async (major: string) => {
    const selectedTemplate = templates.find(t=>t.id === major);

    try {
      const planId = await createTemplateUserPlan.mutateAsync(selectedTemplate.id!);
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
      subtitle="Find your degree template to start planning"
      close={onDismiss}
      actions={[
        {
          name: 'Cancel',
          onClick: onDismiss,
          color: 'secondary',
        },
        {
          name: 'Create Plan',
          onClick: () => handleTemplateCreation(major),
          color: 'primary',
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
      <select
        className="w-full rounded-md border border-neutral-500 py-3 px-4 text-sm text-black/80"
        onChange={(e) => setMajor(e.target.value)}
        defaultValue="placeholder"
      >
        <option disabled value="placeholder">
          <option className="text-neutral-400">Find your major...</option>
        </option>
        {orderedTemplate.map((major) => (
          <option value={major.id} key={major.id}>
            {major.name}
          </option>
        ))}
      </select>
    </Page>
  );
}
