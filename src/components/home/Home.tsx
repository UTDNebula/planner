import ChevronIcon from '@/icons/ChevronIcon';
import PlusIcon from '@/icons/PlusIcon';
import { trpc } from '@utils/trpc';
import { useState } from 'react';

import PlanCard from '../landing/PlanCard';
import TemplateModal from '../template/Modal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Steps } from 'intro.js-react';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const userPlanQuery = trpc.plan.getUserPlans.useQuery();
  const userQuery = trpc.user.getUser.useQuery();
  const { data } = userPlanQuery;
  const userData = userQuery.data;
  if (!data) {
    return <div>You have not created any plans yet</div>;
  }

  const steps = [
    {
      intro: (
        <div className="">
          Hello and welcome to Nebula Labs! <br /> <br /> To help make your user experience as
          seamless as possible, we have created a tutorial that will guide you through the process
          of using our platform.
        </div>
      ),
    },
    {
      element: '#tutorial-1',
      intro: (
        <div className="">
          This is the heart of our platform, where you can create and access your degree plan. Take
          a moment to explore the layout and navigation to familiarize yourself with this section.
        </div>
      ),
    },
    {
      element: '#tutorial-2',
      intro: (
        <div className="">
          To create a new degree plan, click on &quot;Add New Plan.&quot; You have the option to
          import your existing transcript under &quot;Custom Plan&quot; or use our template under
          &quot;Template Plan.&quot;
        </div>
      ),
    },
    {
      element: '#tutorial-3',
      intro: (
        <div className="">
          The sidebar provides access to your profile, tech support, and feedback form. If you
          encounter any issues or have questions, our support team is available to assist you 24/7.
        </div>
      ),
    },
  ];

  return (
    <>
      {/* <Steps enabled={true} steps={steps} initialStep={0} onExit={() => console.log('HI')} /> */}
      <section
        id="tutorial-1"
        className="flex max-h-screen flex-grow flex-col gap-4 overflow-y-scroll p-16"
      >
        <article className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <div className="mb-4 text-4xl font-semibold">Course Dashboard</div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  id="tutorial-2"
                  className="flex h-12 w-52 flex-row items-center gap-4 rounded-md bg-primary p-6 text-white transition-all hover:scale-105"
                >
                  <PlusIcon />
                  <div className="">Add New Plan</div>
                  <ChevronIcon className="rotate-90" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent w-52 border-2 bg-white">
                  <DropdownMenu.Item className="DropdownMenuItem flex h-12 items-center justify-center hover:bg-primary hover:text-white">
                    <button className="h-full w-full" onClick={() => setOpenTemplateModal(true)}>
                      Add Custom Plan
                    </button>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="DropdownMenuSeparator h-0.5 w-52 bg-black opacity-10" />
                  <DropdownMenu.Item className="DropdownMenuItem flex h-12 items-center justify-center hover:bg-primary hover:text-white">
                    <button className="h-full w-full" onClick={() => setOpenTemplateModal(true)}>
                      Add Template Plan
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="ml-1 mb-10 text-lg font-semibold text-[#737373]">
            Welcome {userData?.profile?.name ?? 'Temoc'}
          </div>
        </article>
        <article className=" grid h-fit w-fit grid-cols-3 gap-12">
          {data.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              major={plan.requirements?.major ?? 'undecided'}
            />
          ))}
        </article>
        <article></article>
      </section>
      {openTemplateModal && <TemplateModal setOpenTemplateModal={setOpenTemplateModal} />}
    </>
  );
}
