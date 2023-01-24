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
  const createUserPlan = trpc.user.createUserPlan.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const createEmptyUserPlan = trpc.user.createEmptyUserPlan.useMutation({
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
        const planId = await createEmptyUserPlan.mutateAsync('empty');
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
      const planId = await createUserPlan.mutateAsync(selectedTemplate[0].id);
      console.log('HM');
      console.log(planId);
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
      className="w-full h-full left-0 top-0  absolute flex items-center justify-center backdrop-blur-md z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white relative max-w-4xl m-8 max-h-[90vh] w-full overflow-y-scroll flex-col gap-2 rounded-lg items-center justify-center p-10"
      >
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="p-3 text-2xl">Start fresh with an</div>
          <button
            className="p-2 rounded-lg font-semibold bg-[#3E61ED] hover:bg-[#3552C9] text-white transition-colors border-2 border-[#3e61ed]"
            onClick={() => handleTemplateCreation('empty')}
          >
            Empty Plan
          </button>

          <div className="text-center text-2xl ">OR</div>
          <div className="text-center text-2xl font-medium">One of the templates</div>
        </div>
        <div className="sticky pt-10 -top-10 bg-white z-50">
          <SearchBar
            placeholder="Search template"
            updateQuery={(query) => setTemplateQuery(query)}
          />
        </div>

        <div className="gap-2 px-2 py-4 max-h-[400px]">
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
          className="top-0 right-0 absolute border-black border-2 rounded-lg m-2 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <CloseIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
}
