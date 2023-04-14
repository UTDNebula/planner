import ChevronIcon from '@/icons/ChevronIcon';
import PlusIcon from '@/icons/PlusIcon';
import { trpc } from '@utils/trpc';
import { useState } from 'react';

import PlanCard from '../landing/PlanCard';
import TemplateModal from '../template/Modal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Steps } from 'intro.js-react';
import React from 'react';
import { useRouter } from 'next/router';
import AnalyticsWrapper from '../common/AnalyticsWrapper';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const userPlanQuery = trpc.plan.getUserPlans.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const updateSeenHomeOnboarding = trpc.user.seenHomeOnboarding.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });
  const { data: userData, isLoading } = trpc.user.getUser.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data } = userPlanQuery;
  const [planPage, setPlanPage] = useState<0 | 1>(1);
  const router = useRouter();

  const [showHomeOnboardingModal, setShowHomeOnboardingModal] = useState(false);
  React.useEffect(() => {
    setShowHomeOnboardingModal((userData && !userData.seenHomeOnboardingModal) ?? false);
    if (!isLoading && userData && !userData.onboardingComplete) {
      router.push('/app/onboarding');
      return;
    }
  }, [userData, router, isLoading]);

  const handleCloseHomeOnboarding = () => {
    setShowHomeOnboardingModal(false);
    updateSeenHomeOnboarding.mutateAsync();
  };

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
      intro: (
        <div className="">
          The sidebar provides access to your profile, tech support, and feedback form. If you
          encounter any issues or have questions, our support team is available to assist you 24/7.
        </div>
      ),
    },
  ];

  const utils = trpc.useContext();

  return (
    <>
      <Steps
        enabled={showHomeOnboardingModal}
        steps={steps}
        initialStep={0}
        onExit={handleCloseHomeOnboarding}
        options={{ doneLabel: 'Done' }}
      />
      <section
        id="tutorial-1"
        className="flex max-h-screen flex-grow flex-col gap-4 overflow-y-scroll p-16"
      >
        <article className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <div className="mb-4 text-4xl font-semibold tracking-tight text-primary-900">
              My Degree Plans
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <button
                  id="tutorial-2"
                  data-testid="add-new-plan-btn"
                  className="flex h-12 flex-row items-center gap-4 rounded-md bg-primary p-6 text-white transition-all hover:bg-primary-600 active:bg-primary-600"
                >
                  <PlusIcon />
                  <p>Add New Plan</p>
                  <ChevronIcon className="rotate-90" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="relative top-2 w-min rounded-md border border-neutral-300 bg-generic-white drop-shadow-xl">
                  <AnalyticsWrapper analyticsClass="umami--click--custom-plan">
                    <DropdownItem
                      data-testid="add-custom-plan-btn"
                      text="Add Custom Plan"
                      onClick={() => {
                        setPlanPage(0);
                        setOpenTemplateModal(true);
                      }}
                    />
                  </AnalyticsWrapper>

                  <DropdownMenu.Separator className="DropdownMenuSeparator h-0.5 bg-black opacity-10" />

                  <AnalyticsWrapper analyticsClass="umami--click--template-plan">
                    <DropdownItem
                      text="Add Template Plan"
                      data-testid="add-template-plan-btn"
                      onClick={() => {
                        setPlanPage(1);
                        setOpenTemplateModal(true);
                      }}
                    />
                  </AnalyticsWrapper>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="mb-10 text-lg font-semibold text-[#737373]">
            Welcome{userData?.profile?.name ? ', ' + userData.profile.name : ''}
          </div>
        </article>
        {data?.plans.length === 0 && (
          <div className="flex h-[40vh] flex-col items-center justify-center">
            <div className="mb-4 text-2xl font-semibold text-[#A3A3A3]">
              Add New Plan To Get Started
            </div>
            <div className="text-center text-lg text-[#A3A3A3]">
              Pick template plan if you are a freshman. Pick a <br />
              custom plan if you have transfer credits.
            </div>
          </div>
        )}
        <article className="grid h-fit w-fit grid-cols-3 gap-12">
          {data?.plans.map((plan) => (
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
      {openTemplateModal && (
        <TemplateModal setOpenTemplateModal={setOpenTemplateModal} page={planPage} />
      )}
    </>
  );
}

interface ItemProps {
  text: string;
  onClick: () => void;
}
const DropdownItem = ({ text, onClick, ...props }: ItemProps) => (
  <DropdownMenu.Item
    onClick={onClick}
    className="flex w-full min-w-max cursor-pointer items-center gap-x-3 border-b border-neutral-300 px-2 py-2 text-sm hover:bg-neutral-200"
    {...props}
  >
    <span className="h-full w-full">{text}</span>
  </DropdownMenu.Item>
);
