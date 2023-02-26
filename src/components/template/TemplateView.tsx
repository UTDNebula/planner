import { trpc } from '@/utils/trpc';
import router from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import DataGrid from '../credits/DataGrid';
import SearchBar from '../credits/SearchBar';
import Button from '../Button';

export default function TemplateView({ setPage }: { setPage: Dispatch<SetStateAction<number>> }) {
  const utils = trpc.useContext();

  const [templateQuery, setTemplateQuery] = useState('');

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
      onClick={(e) => e.stopPropagation()}
      className="relative max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center gap-2 overflow-y-scroll rounded-lg bg-white p-10"
    >
      <Button onClick={() => setPage(0)}>Back</Button>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-center text-2xl font-medium">Choose one of the templates</div>
      </div>
      <div className="sticky -top-10 z-50 bg-white pt-10">
        <SearchBar placeholder="Search template" updateQuery={(query) => setTemplateQuery(query)} />
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
    </div>
  );
}
