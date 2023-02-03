import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { trpc } from '@/utils/trpc';

import DataGrid from '../credits/DataGrid';
import SearchBar from '../credits/SearchBar';

interface TemplateModalProps {
  setOpenTemplateModal: (flag: boolean) => void;
}
export default function TemplateModal({ setOpenTemplateModal }: TemplateModalProps) {
  const router = useRouter();
  const [templateQuery, setTemplateQuery] = useState('');
  const utils = trpc.useContext();
  const createTemplateUserPlan = trpc.user.createTemplateUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });
  const { data, isError } = trpc.template.getAllTemplates.useQuery();
  if (isError) {
    console.error('Error fetching templates');
    return <div>Error fetching templates</div>;
  }

  // TODO: Error component for this case
  //
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
    if (major === 'empty') {
      try {
        const planId = await createUserPlan.mutateAsync('empty');
        if (!planId) {
          return router.push('/app/home');
        }
        return router.push(`/app/plans/${planId}`);
      } catch (error) {}
    }
    const selectedTemplate = templates.filter((template) => {
      if (template.name === major) {
        return template;
      }
    });

    try {
      const planId = await createTemplateUserPlan.mutateAsync(selectedTemplate[0].id);
      if (!planId) {
        return router.push('/app/home');
      }
      return router.push(`/app/plans/${planId}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      onClick={() => setOpenTemplateModal(false)}
      className="absolute left-0 top-0 z-10  flex h-full w-full items-center justify-center backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-8 max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center gap-2 overflow-y-scroll rounded-lg bg-white p-10"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 text-2xl">Start fresh with an</div>
          <button
            className="rounded-lg border-2 border-[#3e61ed] bg-[#3E61ED] p-2 font-semibold text-white transition-colors hover:bg-[#3552C9]"
            onClick={() => handleTemplateCreation('empty')}
          >
            Empty Plan
          </button>

          <div className="text-center text-2xl ">OR</div>
          <div className="text-center text-2xl font-medium">One of the templates</div>
        </div>
        <div className="sticky -top-10 z-50 bg-white pt-10">
          <SearchBar
            placeholder="Search template"
            updateQuery={(query) => setTemplateQuery(query)}
          />
        </div>

        <div className="max-h-[400px] gap-2 px-2 py-4">
          <DataGrid
            columns={[
              {
                title: 'Templates',
                key: 'templateName',
                valueGetter: (name) => name.templateName,
              },
            ]}
            rows={
              [...orderedTemplate.map((x) => ({ templateName: x.name }))] as {
                templateName: string;
              }[]
            }
            childrenProps={{
              headerProps: {
                style: {
                  padding: '20px 0',
                },
              },
              gridProps: {
                style: {},
              },
              rowProps: {
                style: {
                  borderTop: '1px solid #DEDFE1',
                  padding: '20px 0',
                  cursor: 'pointer',
                },
                onClick: (row) => {
                  const newRow: { templateName: string } = row as { templateName: string };
                  handleTemplateCreation(newRow.templateName);
                },
              },
            }}
            RowCellComponent={({ children }) => <span className="text-black">{children}</span>}
            TitleComponent={({ children }) => <h4 className="text-black">{children}</h4>}
            LoadingComponent={() => <h2 className="text-black">Loading...</h2>}
          />
        </div>
        <button
          onClick={() => setOpenTemplateModal(false)}
          className="absolute top-0 right-0 m-2 rounded-lg border-2 border-black transition-colors hover:bg-slate-700 hover:text-white"
        >
          <CloseIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
}
