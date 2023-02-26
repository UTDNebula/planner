import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { DegreeValidation, Plan } from './types';

export interface usePlanProps {
  planId: string;
}

export interface usePlanReturn {
  plan?: Plan;
  validation?: DegreeValidation;
  isPlanLoading: boolean;
  handlePlanDelete: () => Promise<boolean>;
}

const usePlan = ({ planId }: usePlanProps): usePlanReturn => {
  const utils = trpc.useContext();
  const router = useRouter();

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
    isPlanLoading: planQuery.isLoading,
    handlePlanDelete,
  };
};

export default usePlan;
