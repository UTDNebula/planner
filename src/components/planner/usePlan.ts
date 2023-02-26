import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { Credit, DegreeValidation, Plan } from './types';

export interface usePlanProps {
  planId: string;
}

export interface usePlanReturn {
  plan?: Plan;
  credits?: Credit[];
  validation?: DegreeValidation;
  isPlanLoading: boolean;
  isCreditsLoading: boolean;
  handlePlanDelete: () => Promise<boolean>;
}

const usePlan = ({ planId }: usePlanProps): usePlanReturn => {
  const utils = trpc.useContext();
  const router = useRouter();

  const creditsQuery = trpc.credits.getCredits.useQuery(undefined, { staleTime: 10000000000 });

  const planQuery = trpc.plan.getPlanById.useQuery(planId);

  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const handlePlanDelete = async () => {
    return deletePlan
      .mutateAsync(planId)
      .then((deleted) => (deleted ? router.push('/app/home') : router.push('/app/home')))
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  return {
    plan: planQuery.data?.plan,
    validation: planQuery.data?.validation,
    credits: creditsQuery.data,
    isPlanLoading: planQuery.isLoading,
    isCreditsLoading: creditsQuery.isLoading,
    handlePlanDelete,
  };
};

export default usePlan;
